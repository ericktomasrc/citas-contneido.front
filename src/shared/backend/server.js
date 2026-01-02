import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const APP_ID = process.env.VITE_AGORA_APP_ID || 'ab41c61677c841dea4b85741c7ad07f8';
const APP_CERTIFICATE = process.env.VITE_AGORA_APP_CERTIFICATE || 'd4ad8566672044b297a08882052c9c75';

// Habilitar CORS
app.use(cors());

// Almacenar espectadores por canal
const espectadoresPorCanal = new Map();
// Almacenar estado de canales (activo/cerrado)
const canalesActivos = new Map();
// Almacenar configuración del chat por canal
const chatConfigPorCanal = new Map();

app.get('/api/agora/token', (req, res) => {
  const { channelName, userId } = req.query;
  
  if (!channelName || !userId) {
    return res.status(400).json({ error: 'channelName y userId son requeridos' });
  }

  try {
    const uid = parseInt(userId);
    const role = RtcRole.PUBLISHER;
    
    // Tiempo de expiración: 24 horas
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    console.log('✅ Token generado para:', channelName, userId);
    console.log('⏰ Expira en:', expirationTimeInSeconds / 3600, 'horas');
    
    res.json({ token, appId: APP_ID });
  } catch (error) {
    console.error('❌ Error generando token:', error);
    res.status(500).json({ error: 'Error generando token' });
  }
});

// Endpoint para registrar espectador
app.post('/api/espectador/unirse', express.json(), (req, res) => {
  const { channelName, userId } = req.body;
  
  if (!channelName || !userId) {
    return res.status(400).json({ error: 'channelName y userId son requeridos' });
  }

  if (!espectadoresPorCanal.has(channelName)) {
    espectadoresPorCanal.set(channelName, new Set());
  }
  
  espectadoresPorCanal.get(channelName).add(userId);
  const total = espectadoresPorCanal.get(channelName).size;
  
  console.log(`👤 Espectador ${userId} se unió a ${channelName}. Total: ${total}`);
  res.json({ espectadores: total });
});

// Endpoint para des-registrar espectador
app.post('/api/espectador/salir', express.json(), (req, res) => {
  const { channelName, userId } = req.body;
  
  if (!channelName || !userId) {
    return res.status(400).json({ error: 'channelName y userId son requeridos' });
  }

  if (espectadoresPorCanal.has(channelName)) {
    espectadoresPorCanal.get(channelName).delete(userId);
    const total = espectadoresPorCanal.get(channelName).size;
    
    if (total === 0) {
      espectadoresPorCanal.delete(channelName);
    }
    
    console.log(`👋 Espectador ${userId} salió de ${channelName}. Total: ${total}`);
    res.json({ espectadores: total });
  } else {
    res.json({ espectadores: 0 });
  }
});

// Endpoint para obtener cantidad de espectadores
app.get('/api/espectadores/:channelName', (req, res) => {
  const { channelName } = req.params;
  const total = espectadoresPorCanal.has(channelName) 
    ? espectadoresPorCanal.get(channelName).size 
    : 0;
  
  res.json({ espectadores: total });
});

// Endpoint para iniciar canal (creadora)
app.post('/api/canal/iniciar', express.json(), (req, res) => {
  const { channelName } = req.body;
  
  if (!channelName) {
    return res.status(400).json({ error: 'channelName es requerido' });
  }

  canalesActivos.set(channelName, true);
  console.log(`🟢 Canal ${channelName} iniciado`);
  
  res.json({ success: true, activo: true });
});

// Endpoint para finalizar canal (creadora)
app.post('/api/canal/finalizar', express.json(), (req, res) => {
  const { channelName } = req.body;
  
  if (!channelName) {
    return res.status(400).json({ error: 'channelName es requerido' });
  }

  // Marcar canal como inactivo
  canalesActivos.set(channelName, false);
  
  // Limpiar espectadores
  espectadoresPorCanal.delete(channelName);
  
  console.log(`🔴 Canal ${channelName} finalizado y limpiado`);
  
  res.json({ success: true, activo: false });
});

// Endpoint para verificar si un canal está activo
app.get('/api/canal/:channelName/activo', (req, res) => {
  const { channelName } = req.params;
  const activo = canalesActivos.get(channelName) === true;
  
  res.json({ activo });
});

const PORT = 5000;

// Socket.io - Chat en tiempo real
io.on('connection', (socket) => {
  console.log('👤 Usuario conectado:', socket.id);

  // Unirse a un canal específico
  socket.on('join-channel', (data) => {
    const channelName = typeof data === 'string' ? data : data.channelName;
    socket.join(channelName);
    console.log(`✅ Usuario ${socket.id} se unió al canal: ${channelName}`);
    
    // Enviar configuración actual del chat al nuevo usuario
    if (chatConfigPorCanal.has(channelName)) {
      const config = chatConfigPorCanal.get(channelName);
      console.log(`📤 Enviando configuración a ${socket.id}:`, config);
      socket.emit('chat-config-updated', config);
    } else {
      console.log(`⚠️ No hay configuración guardada para el canal: ${channelName}`);
    }
  });

  // Actualizar configuración del chat (solo creadora)
  socket.on('update-chat-config', (data) => {
    const { channelName, config } = data;
    chatConfigPorCanal.set(channelName, config);
    console.log(`⚙️ Configuración del chat actualizada para ${channelName}:`, config);
    
    // Emitir la nueva configuración a todos en el canal
    io.to(channelName).emit('chat-config-updated', config);
  });

  // Mensaje de chat
  socket.on('chat-message', (data) => {
    const { channelName, user, mensaje, isVIP, avatar } = data;
    io.to(channelName).emit('new-message', {
      id: Date.now(),
      user,
      mensaje,
      isVIP,
      avatar,
      timestamp: new Date().toISOString()
    });
  });

  // Regalo/Donación
  socket.on('send-gift', (data) => {
    const { channelName, giftId, user, gift, isVIP, avatar } = data;
    io.to(channelName).emit('new-gift', {
      id: giftId || Date.now().toString(), // Usar el ID del cliente o generar uno nuevo
      user,
      gift,
      isVIP,
      avatar,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('👋 Usuario desconectado:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor Agora + Socket.io corriendo en http://localhost:${PORT}`);
});