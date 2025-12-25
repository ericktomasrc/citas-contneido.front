import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, DollarSign, Hand  } from 'lucide-react';

export const SeleccionarTipoUsuarioPage = () => {
  const navigate = useNavigate();
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    //  Leer desde localStorage
    const registrationDataStr = localStorage.getItem('temp_registration');
    
    if (!registrationDataStr) {
      // No hay datos de registro
      navigate('/register');
      return;
    }

    try {
      const registrationData = JSON.parse(registrationDataStr);
      
      // ✅ Validar expiración (30 minutos)
      const now = Date.now();
      const elapsed = now - registrationData.timestamp;
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (elapsed > thirtyMinutes) {
        localStorage.removeItem('temp_registration');
        navigate('/register');
        return;
      }

      // ✅ Validar que tenga userId
      if (!registrationData.userId) {
        localStorage.removeItem('temp_registration');
        navigate('/register');
        return;
      }

      setUsuarioId(registrationData.userId);
    } catch (err) {
      localStorage.removeItem('temp_registration');
      navigate('/register');
    }
  }, [navigate]);

  const handleContinuar = async () => {
    if (!tipoSeleccionado) {
      setError('Por favor selecciona un tipo de cuenta');
      return;
    }

    if (!usuarioId) {
      setError('Sesión expirada. Por favor inicia el registro nuevamente.');
      navigate('/register');
      return;
    }

    setLoading(true);
    setError('');

    try {
      //  Actualizar localStorage con el tipo seleccionado
      const registrationDataStr = localStorage.getItem('temp_registration');
      if (registrationDataStr) {
        const registrationData = JSON.parse(registrationDataStr);
        registrationData.tipoUsuario = tipoSeleccionado;
        localStorage.setItem('temp_registration', JSON.stringify(registrationData));
      }

      // Navegar sin parámetros sensibles en URL
      navigate('/completar-registro');
    } catch (err: any) {
      setError('Error al continuar');
    } finally {
      setLoading(false);
    }
  };

  //  Validación de carga
  if (!usuarioId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */} 
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            ¡Hola! <Hand className="w-8 h-8 text-amber-500" /> {/*   Reemplazado */}
          </h2>
          <p className="text-gray-600">
            Elige el tipo de cuenta que mejor se adapte a ti
          </p>
        </div>
        {/* Opciones */}
       <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Opción Consumidor/Viewer */}
            <button
              onClick={() => setTipoSeleccionado(1)}
              className={`p-6 rounded-xl border-2 transition-all ${
                tipoSeleccionado === 1
                  ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
              }`}
            >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white mb-4 mx-auto">
              <Eye className="w-10 h-10" /> {/*   Reemplazado */}
            </div>
              <p className="text-gray-700 text-sm mb-4 text-center font-medium">
                Quiero conocer personas y disfrutar de contenido exclusivo
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">✓</span>
                  Ver perfiles y contenido
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">✓</span>
                  Conectar con creadores
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">✓</span>
                  Transmisiones en vivo
                </li>
              </ul>
            </button>

            {/* Opción Creador/Monetizar */}
            <button
              onClick={() => setTipoSeleccionado(2)}
              className={`p-6 rounded-xl border-2 transition-all ${
                tipoSeleccionado === 2
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-4 mx-auto">
              <DollarSign className="w-10 h-10" /> {/* ✅ Reemplazado */}
            </div>
              <p className="text-gray-700 text-sm mb-4 text-center font-medium">
                Quiero monetizar mi contenido y construir mi audiencia
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  Subir contenido exclusivo
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  Hacer transmisiones en vivo
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  Ganar dinero por suscripciones
                </li>
              </ul>
            </button>
      </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botón Continuar */}
        <button
          onClick={handleContinuar}
          disabled={!tipoSeleccionado || loading}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Continuando...' : 'Continuar'}
        </button>

        {/* Nota */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Podrás cambiar el tipo de cuenta más adelante en tu perfil
        </p>
      </div>
    </div>
  );
};