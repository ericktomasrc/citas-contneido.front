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
// Almacenar estado de canales (activo/cerrado con metadata)
const canalesActivos = new Map();
// Almacenar configuración del chat por canal
const chatConfigPorCanal = new Map();
// Almacenar estado de las metas por canal
const metasPorCanal = new Map();
// Almacenar estado de ruletas por canal
const ruletasPorCanal = new Map();
// Almacenar giros en progreso por canal (para bloqueo centralizado)
const girosEnProgresoPorCanal = new Map();

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
  const { channelName, tipoTransmision, precioPPV, descripcionPPV } = req.body;
  
  if (!channelName) {
    return res.status(400).json({ error: 'channelName es requerido' });
  }

  // Guardar metadata del canal
  canalesActivos.set(channelName, {
    activo: true,
    tipoTransmision: tipoTransmision || 'gratis',
    precioPPV: precioPPV || 0,
    descripcionPPV: descripcionPPV || '',
    iniciadoEn: new Date()
  });
  
  console.log(`🟢 Canal ${channelName} iniciado - Tipo: ${tipoTransmision || 'gratis'}${tipoTransmision === 'ppv' ? ` - Precio: S/.${precioPPV}` : ''}`);
  
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
  
  // Limpiar configuración del chat
  chatConfigPorCanal.delete(channelName);
  
  // Limpiar meta del canal
  metasPorCanal.delete(channelName);
  
  // Limpiar ruleta del canal
  ruletasPorCanal.delete(channelName);
  
  // Notificar a todos los espectadores que la ruleta fue desactivada
  io.to(channelName).emit('ruleta-desactivada');
  
  console.log(`🔴 Canal ${channelName} finalizado y limpiado (incluyendo ruleta)`);
  
  res.json({ success: true, activo: false });
});

// Endpoint para verificar si un canal está activo y obtener su configuración
app.get('/api/canal/:channelName/activo', (req, res) => {
  const { channelName } = req.params;
  const canalData = canalesActivos.get(channelName);
  const activo = canalData && canalData.activo === true;
  
  res.json({ 
    activo,
    tipoTransmision: activo ? canalData.tipoTransmision : 'gratis',
    precioPPV: activo ? canalData.precioPPV : 0,
    descripcionPPV: activo ? canalData.descripcionPPV : ''
  });
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
    
    // Preparar datos del canal
    const channelData = {};
    
    // Enviar configuración actual del chat al nuevo usuario
    if (chatConfigPorCanal.has(channelName)) {
      const config = chatConfigPorCanal.get(channelName);
      console.log(`📤 Enviando configuración a ${socket.id}:`, config);
      socket.emit('chat-config-updated', config);
    } else {
      console.log(`⚠️ No hay configuración guardada para el canal: ${channelName}`);
    }
    
    // Enviar estado actual de la meta al nuevo espectador
    if (metasPorCanal.has(channelName)) {
      const metaActual = metasPorCanal.get(channelName);
      console.log(`🎯 Enviando meta actual a ${socket.id}:`, metaActual);
      channelData.meta = metaActual;
      socket.emit('meta-updated', metaActual);
      socket.emit('channel-joined', channelData);
    } else {
      console.log(`⚠️ No hay meta configurada para el canal: ${channelName}`);
      socket.emit('channel-joined', channelData);
    }
  });

  // Unirse a un live (espectadores)
  socket.on('join-live', (data) => {
    const { liveId } = data;
    const channelName = `live_${liveId}`;
    socket.join(channelName);
    console.log(`👀 Espectador ${socket.id} se unió al live: ${channelName}`);
    
    // Enviar configuración del chat si existe
    if (chatConfigPorCanal.has(channelName)) {
      socket.emit('chat-config-updated', chatConfigPorCanal.get(channelName));
    }
    
    // Enviar estado de la meta si existe
    if (metasPorCanal.has(channelName)) {
      socket.emit('meta-updated', metasPorCanal.get(channelName));
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

  // Me gusta / Like
  socket.on('send-like', (data) => {
    const { channelName, user, timestamp } = data;
    // Broadcast a todos en el canal (incluido el remitente)
    io.to(channelName).emit('new-like', {
      user,
      timestamp
    });
  });

  // Reacciones (corazones, aplausos, fuego, etc.)
  socket.on('send-reaction', (data) => {
    const { channelName, liveId, reaction, creatorId, username, timestamp } = data;
    // Usar channelName si está disponible, sino construirlo con liveId
    const targetChannel = channelName || `live_${liveId}`;
    
    console.log('❤️ Reacción recibida:', { targetChannel, reaction, username });
    
    // Broadcast a todos en el canal (espectadores + creadora)
    io.to(targetChannel).emit('send-reaction', {
      reaction,
      username,
      timestamp
    });
  });

  // Propinas rápidas
  socket.on('send-tip', (data) => {
    const { channelName, tipId, user, monto, isVIP, avatar } = data;
    console.log('💵 Propina recibida:', { channelName, user, monto });
    
    io.to(channelName).emit('new-tip', {
      id: tipId || Date.now().toString(),
      user,
      monto,
      isVIP,
      avatar,
      timestamp: new Date().toISOString()
    });
  });

  // Super Chat / Mensajes Destacados
  socket.on('send-superchat', (data) => {
    const { channelName, superChatId, user, mensaje, monto, tier, isVIP, avatar } = data;
    console.log('💬💰 Super Chat recibido:', { channelName, user, monto, tier });
    
    io.to(channelName).emit('new-superchat', {
      id: superChatId || Date.now().toString(),
      user,
      mensaje,
      monto,
      tier, // 'basic', 'premium', 'elite'
      isVIP,
      avatar,
      timestamp: new Date().toISOString()
    });
  });

  // Actualizar meta (creadora → espectadores)
  socket.on('update-meta', (data) => {
    const { channelName, activa, monto, descripcion, progreso } = data;
    console.log('🎯 Actualización de meta recibida:', { channelName, activa, monto, descripcion, progreso });
    
    // Guardar estado de la meta para nuevos espectadores
    metasPorCanal.set(channelName, {
      activa,
      monto,
      descripcion,
      progreso
    });
    
    // Broadcast a TODOS en el canal (incluye creadora y espectadores)
    io.to(channelName).emit('meta-updated', {
      activa,
      monto,
      descripcion,
      progreso
    });
    
    console.log(`📢 Meta actualizada broadcast a canal: ${channelName}`);
  });

  // Eventos de Ruleta
  socket.on('ruleta-activada', (data) => {
    const { channelName, costoGiro, premios } = data;
    console.log('🎰 Ruleta activada:', { channelName, costoGiro });
    
    // Guardar estado
    ruletasPorCanal.set(channelName, {
      activa: true,
      costoGiro,
      premios
    });
    
    // Broadcast a todos los espectadores
    io.to(channelName).emit('ruleta-activada', {
      channelName,
      costoGiro,
      premios
    });
  });

  socket.on('ruleta-desactivada', (data) => {
    const { channelName } = data;
    console.log('🎰 Ruleta desactivada:', channelName);
    
    // Guardar estado
    ruletasPorCanal.set(channelName, {
      activa: false,
      costoGiro: 0,
      premios: []
    });
    
    io.to(channelName).emit('ruleta-desactivada');
  });

  // Solicitar estado de ruleta
  socket.on('solicitar-estado-ruleta', (data) => {
    const { channelName } = data;
    const estadoRuleta = ruletasPorCanal.get(channelName) || { activa: false, costoGiro: 10, premios: [] };
    console.log('🎰 Solicitud de estado ruleta:', channelName, estadoRuleta);
    
    socket.emit('estado-ruleta', {
      activa: estadoRuleta.activa,
      costoGiro: estadoRuleta.costoGiro || 10,
      premios: estadoRuleta.premios || []
    });
  });

  // Cuando un espectador SOLICITA girar (validación centralizada)
  socket.on('solicitar-giro-ruleta', (data) => {
    const { channelName, usuario } = data;
    console.log('='.repeat(80));
    console.log('🟢 [SERVER] SOLICITUD DE GIRO recibida');
    console.log('📍 Canal:', channelName);
    console.log('👤 Usuario:', usuario);
    
    // Verificar si alguien ya está girando en este canal
    const giroEnProgreso = girosEnProgresoPorCanal.get(channelName);
    
    if (giroEnProgreso) {
      // RECHAZAR: Alguien ya está girando
      console.log('❌ [SERVER] Giro RECHAZADO - ruleta ocupada por:', giroEnProgreso.usuario);
      console.log('='.repeat(80));
      socket.emit('ruleta-ocupada');
      return;
    }
    
    // ACEPTAR: Nadie está girando, otorgar permiso
    console.log('✅ [SERVER] Giro ACEPTADO - otorgando permiso');
    
    // Marcar como ocupado
    girosEnProgresoPorCanal.set(channelName, {
      usuario,
      timestamp: Date.now()
    });
    
    // Notificar al solicitante que tiene permiso
    socket.emit('permiso-giro-concedido', { usuario });
    console.log('📤 [SERVER] Permiso enviado a:', usuario);
    
    // Broadcast a TODOS que alguien está girando (bloquear UI para todos)
    io.to(channelName).emit('ruleta-iniciando-giro', { usuario });
    console.log('📡 [SERVER] Bloqueando ruleta para todos en:', channelName);
    console.log('='.repeat(80));
  });

  socket.on('girar-ruleta', (data) => {
    const { channelName, usuario, premio } = data;
    console.log('🎰 [SERVER] Giro completado:', { channelName, usuario, premio: premio.nombre });
    
    // LIBERAR el bloqueo del canal
    const estabaOcupado = girosEnProgresoPorCanal.has(channelName);
    girosEnProgresoPorCanal.delete(channelName);
    
    if (estabaOcupado) {
      console.log('🔓 [SERVER] Ruleta liberada - disponible para nuevo giro en:', channelName);
    }
    
    // Broadcast resultado a todos (incluye animación para todos los espectadores)
    io.to(channelName).emit('ruleta-resultado', {
      usuario,
      premio
    });
  });

  socket.on('disconnect', () => {
    console.log('👋 Usuario desconectado:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor Agora + Socket.io corriendo en http://localhost:${PORT}`);
});