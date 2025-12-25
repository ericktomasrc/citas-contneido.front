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