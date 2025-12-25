import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@features/auth/api/authApi';

export const VerificarEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuarioId, setUsuarioId] = useState<string>('');

  useEffect(() => {
    const verificar = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('Token de verificación no proporcionado');
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.verificarEmail({ token });        
        if (response.usuarioId) {
          setUsuarioId(response.usuarioId);
          
          // ✅ Guardar en localStorage con timestamp de seguridad
          const registrationData = {
            userId: response.usuarioId,
            timestamp: Date.now(),
            emailVerified: true
          };
          localStorage.setItem('temp_registration', JSON.stringify(registrationData));
          
          setTimeout(() => {
            navigate('/seleccionar-tipo-usuario'); // Sin parámetros
          }, 2000);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al verificar el email');
      } finally {
        setLoading(false);
      }
    };

    verificar();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando tu email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error de verificación
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/register"
              className="inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700"
            >
              Volver a registrarse
            </a>
          </div>
        </div>
      </div>
    );
  }

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
            ¡Email verificado!
          </h2>
          <p className="text-gray-600">
            Redirigiendo para completar tu registro...
          </p>
        </div>
      </div>
    </div>
  );
};