const API_URL = 'https://localhost:44315/api';

export const completarRegistro = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/auth/completar-registro`, {
      method: 'POST',
      body: formData
    });
    
    // Obtener el texto de la respuesta
    const text = await response.text();
    
    // Intentar parsearlo como JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // Si no es JSON válido, lanzar error con el texto
      throw new Error(text || 'Error al procesar la respuesta del servidor');
    }
    
    // Si la respuesta no es ok, lanzar error con el mensaje del backend
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error al completar registro');
    }
    
    return data;
  } catch (error: any) {
    // Re-lanzar el error para que lo capture el try-catch del componente
    throw error;
  }
}; 

export const sendPasswordResetCode = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};

export const verifyPasswordResetCode = async (email: string, code: string) => {
  const response = await fetch(`${API_URL}/auth/verify-reset-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code })
  });
  return response.json();
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword })
  });
  return response.json();
};

export const solicitarRecuperacionPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/PasswordReset/solicitar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al solicitar recuperación');
  }

  return response.json();
};

export const verificarCodigoRecuperacion = async (email: string, codigo: string) => {
  const response = await fetch(`${API_URL}/PasswordReset/verificar-codigo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Código inválido');
  }

  return response.json();
};

export const restablecerPassword = async (
  email: string, 
  codigo: string, 
  nuevaPassword: string, 
  confirmarPassword: string
) => {
  const response = await fetch(`${API_URL}/PasswordReset/restablecer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo, nuevaPassword, confirmarPassword })
  });

  const data = await response.json();

  if (!response.ok) {
    // ✅ Lanzar el mensaje que viene del backend
    throw new Error(data.message || 'Error al restablecer contraseña');
  }

  return data;
};