import express from 'express';
import cors from 'cors';
import pkg from 'agora-access-token';
const { RtcTokenBuilder, RtcRole } = pkg;

const app = express();
const APP_ID = 'ab41c61677c841dea4b85741c7ad07f8';
const APP_CERTIFICATE = 'd4ad8566672044b297a08882052c9c75'; // Copia el que está a la izquierda

// Habilitar CORS
app.use(cors());

// Almacenar espectadores por canal
const espectadoresPorCanal = new Map();
// Almacenar estado de canales (activo/cerrado)
const canalesActivos = new Map();

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
app.listen(PORT, () => {
  console.log(`🚀 Servidor Agora corriendo en http://localhost:${PORT}`);
});