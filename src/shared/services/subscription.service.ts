// ============================================
// SERVICIO SIMULADO DE SUSCRIPCIONES
// TODO: BACKEND - Reemplazar con llamadas reales a API C#
// ============================================

import { TipoSuscripcion, UsuarioSuscripcion, AccesoPPV } from '../types/subscription.types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// ============================================
// SIMULACIÓN CON LOCALSTORAGE (TEMPORAL)
// ============================================

const STORAGE_KEYS = {
  SUSCRIPCIONES: 'suscripciones_usuario',
  ACCESOS_PPV: 'accesos_ppv_usuario',
  USER_ID: 'user_id_temp' // Temporal hasta tener login real
};

// Obtener userId temporal (en producción vendrá del login)
const getTempUserId = (): string => {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
};

// ============================================
// VERIFICAR SUSCRIPCIÓN
// ============================================
export const verificarSuscripcion = async (
  creadoraId: string
): Promise<{ esSuscriptor: boolean; tipoSuscripcion?: TipoSuscripcion }> => {
  // TODO: BACKEND C# - GET /api/suscripciones/verificar/:userId/:creadoraId
  
  try {
    const userId = getTempUserId();
    
    // SIMULACIÓN: Leer de localStorage
    const suscripcionesStr = localStorage.getItem(STORAGE_KEYS.SUSCRIPCIONES);
    if (!suscripcionesStr) {
      return { esSuscriptor: false };
    }

    const suscripciones: Record<string, UsuarioSuscripcion> = JSON.parse(suscripcionesStr);
    const suscripcion = suscripciones[creadoraId];

    if (!suscripcion || !suscripcion.activa) {
      return { esSuscriptor: false };
    }

    // Verificar que no haya expirado
    if (new Date(suscripcion.fechaExpiracion) < new Date()) {
      return { esSuscriptor: false };
    }

    return {
      esSuscriptor: true,
      tipoSuscripcion: suscripcion.tipoSuscripcion
    };

    /* 
    // IMPLEMENTACIÓN REAL CON C#:
    const response = await fetch(`${BACKEND_URL}/api/suscripciones/verificar/${userId}/${creadoraId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}` // Tu token JWT
      }
    });
    const data = await response.json();
    return {
      esSuscriptor: data.esSuscriptor,
      tipoSuscripcion: data.tipoSuscripcion
    };
    */
  } catch (error) {
    console.error('Error verificando suscripción:', error);
    return { esSuscriptor: false };
  }
};

// ============================================
// CREAR SUSCRIPCIÓN
// ============================================
export const crearSuscripcion = async (
  creadoraId: string,
  tipoSuscripcion: TipoSuscripcion,
  metodoPago: string = 'tarjeta'
): Promise<{ success: boolean; transaccionId?: string; error?: string }> => {
  // TODO: BACKEND C# - POST /api/suscripciones/crear
  
  try {
    const userId = getTempUserId();
    
    // SIMULACIÓN: Guardar en localStorage
    const nuevaSuscripcion: UsuarioSuscripcion = {
      userId,
      creadoraId,
      tipoSuscripcion,
      activa: true,
      fechaInicio: new Date(),
      fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      renovacionAutomatica: true
    };

    const suscripcionesStr = localStorage.getItem(STORAGE_KEYS.SUSCRIPCIONES) || '{}';
    const suscripciones = JSON.parse(suscripcionesStr);
    suscripciones[creadoraId] = nuevaSuscripcion;
    localStorage.setItem(STORAGE_KEYS.SUSCRIPCIONES, JSON.stringify(suscripciones));

    console.log('✅ Suscripción creada (simulada):', nuevaSuscripcion);

    return {
      success: true,
      transaccionId: `txn_${Date.now()}`
    };

    /* 
    // IMPLEMENTACIÓN REAL CON C#:
    const response = await fetch(`${BACKEND_URL}/api/suscripciones/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        userId,
        creadoraId,
        tipoSuscripcion,
        metodoPago
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al crear suscripción');
    }
    
    const data = await response.json();
    return {
      success: data.success,
      transaccionId: data.transaccionId
    };
    */
  } catch (error) {
    console.error('Error creando suscripción:', error);
    return {
      success: false,
      error: 'Error al procesar el pago'
    };
  }
};

// ============================================
// VERIFICAR ACCESO PPV
// ============================================
export const verificarAccesoPPV = async (
  channelName: string
): Promise<{ tieneAcceso: boolean }> => {
  // TODO: BACKEND C# - GET /api/ppv/verificar/:userId/:channelName
  
  try {
    const userId = getTempUserId();
    
    // SIMULACIÓN: Leer de localStorage
    const accesosStr = localStorage.getItem(STORAGE_KEYS.ACCESOS_PPV);
    if (!accesosStr) {
      return { tieneAcceso: false };
    }

    const accesos: Record<string, AccesoPPV> = JSON.parse(accesosStr);
    const acceso = accesos[channelName];

    return {
      tieneAcceso: !!acceso
    };

    /* 
    // IMPLEMENTACIÓN REAL CON C#:
    const response = await fetch(`${BACKEND_URL}/api/ppv/verificar/${userId}/${channelName}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    const data = await response.json();
    return { tieneAcceso: data.tienePago };
    */
  } catch (error) {
    console.error('Error verificando acceso PPV:', error);
    return { tieneAcceso: false };
  }
};

// ============================================
// PAGAR PPV
// ============================================
export const pagarPPV = async (
  channelName: string,
  monto: number,
  metodoPago: string = 'tarjeta'
): Promise<{ success: boolean; accesoId?: string; error?: string }> => {
  // TODO: BACKEND C# - POST /api/ppv/pagar
  
  try {
    const userId = getTempUserId();
    
    // SIMULACIÓN: Guardar en localStorage
    const nuevoAcceso: AccesoPPV = {
      userId,
      channelName,
      montoPagado: monto,
      fechaPago: new Date(),
      transaccionId: `ppv_${Date.now()}`
    };

    const accesosStr = localStorage.getItem(STORAGE_KEYS.ACCESOS_PPV) || '{}';
    const accesos = JSON.parse(accesosStr);
    accesos[channelName] = nuevoAcceso;
    localStorage.setItem(STORAGE_KEYS.ACCESOS_PPV, JSON.stringify(accesos));

    console.log('✅ PPV pagado (simulado):', nuevoAcceso);

    return {
      success: true,
      accesoId: nuevoAcceso.transaccionId
    };

    /* 
    // IMPLEMENTACIÓN REAL CON C#:
    const response = await fetch(`${BACKEND_URL}/api/ppv/pagar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        userId,
        channelName,
        monto,
        metodoPago
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al procesar pago PPV');
    }
    
    const data = await response.json();
    return {
      success: data.success,
      accesoId: data.accesoId
    };
    */
  } catch (error) {
    console.error('Error pagando PPV:', error);
    return {
      success: false,
      error: 'Error al procesar el pago'
    };
  }
};

// ============================================
// CANCELAR SUSCRIPCIÓN
// ============================================
export const cancelarSuscripcion = async (
  creadoraId: string
): Promise<{ success: boolean }> => {
  // TODO: BACKEND C# - POST /api/suscripciones/cancelar
  
  try {
    const userId = getTempUserId();
    
    // SIMULACIÓN: Eliminar de localStorage
    const suscripcionesStr = localStorage.getItem(STORAGE_KEYS.SUSCRIPCIONES);
    if (suscripcionesStr) {
      const suscripciones = JSON.parse(suscripcionesStr);
      delete suscripciones[creadoraId];
      localStorage.setItem(STORAGE_KEYS.SUSCRIPCIONES, JSON.stringify(suscripciones));
    }

    console.log('✅ Suscripción cancelada (simulada)');

    return { success: true };

    /* 
    // IMPLEMENTACIÓN REAL CON C#:
    const response = await fetch(`${BACKEND_URL}/api/suscripciones/cancelar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        userId,
        creadoraId
      })
    });
    
    const data = await response.json();
    return { success: data.success };
    */
  } catch (error) {
    console.error('Error cancelando suscripción:', error);
    return { success: false };
  }
};
