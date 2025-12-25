import { useState } from 'react';
import { authApi } from '@features/auth/api/authApi';
import { useNavigate } from 'react-router-dom'; 

export const RegisterPage = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await authApi.registrarEmail({ email });
    
    // ✅ CASO ESPECIAL: Usuario ya verificó email pero no completó registro
    if (response.message?.startsWith('CONTINUAR_REGISTRO')) {
      const userId = response.message.split('|')[1];
      
      // ✅ Guardar en localStorage con timestamp de seguridad
      const registrationData = {
        userId: userId,
        timestamp: Date.now(),
        email: email // Para mostrar en pantallas siguientes
      };
      localStorage.setItem('temp_registration', JSON.stringify(registrationData));
      
      // Navegar sin parámetros en URL
      navigate('/seleccionar-tipo-usuario');
      return;
    }
    
    if (response.message) {
      setSuccess(true);
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Error al registrar el email');
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Correo enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de verificación a <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Por favor revisa tu correo (también spam) y haz clic en el enlace para continuar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu email para comenzar
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Continuar'}
          </button>

          <div className="text-center">
            <a 
              href="/login" 
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};