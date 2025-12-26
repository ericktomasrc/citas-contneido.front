import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { restablecerPassword, solicitarRecuperacionPassword, verificarCodigoRecuperacion } from '@/shared/api/authApi';

export const RecuperarPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nueva Password
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validación de requisitos de contraseña
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[\W_]/.test(newPassword)
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

  // PASO 1: Enviar código al email
const handleSendCode = async () => {
  if (!email || !email.includes('@')) {
    setError('Por favor ingresa un email válido');
    return;
  }

  setLoading(true);
  setError('');

  try {
    await solicitarRecuperacionPassword(email);
    setStep(2);
  } catch (err: any) {
    setError(err.message || 'Error al enviar el código');
  } finally {
    setLoading(false);
  }
};

  // PASO 2: Verificar código
const handleVerifyCode = async () => {
  const fullCode = codigo.join('');
  
  if (fullCode.length !== 6) {
    setError('Ingresa el código completo de 6 dígitos');
    return;
  }

  setLoading(true);
  setError('');

  try {
    await verificarCodigoRecuperacion(email, fullCode);
    setStep(3);
  } catch (err: any) {
    setError(err.message || 'Código inválido o expirado');
  } finally {
    setLoading(false);
  }
};

  // PASO 3: Cambiar contraseña
const handleResetPassword = async () => {
  if (!allRequirementsMet) {
    setError('La contraseña no cumple con todos los requisitos');
    return;
  }

  if (newPassword !== confirmPassword) {
    setError('Las contraseñas no coinciden');
    return;
  }

  setLoading(true);
  setError('');

  try {
    await restablecerPassword(email, codigo.join(''), newPassword, confirmPassword);
    setStep(4);
    
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  } catch (err: any) {
    console.error('Error completo:', err); // ✅ Ver error completo en consola
    
    // ✅ Extraer mensaje del error
    let errorMessage = 'Error al cambiar la contraseña';
    
    if (err.message) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  // Manejar input de código (auto-focus en siguiente campo)
  const handleCodigoChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Solo números

    const newCodigo = [...codigo];
    newCodigo[index] = value.slice(0, 1);
    setCodigo(newCodigo);

    // Auto-focus en el siguiente campo
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Manejar backspace
  const handleCodigoKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* ========== PASO 1: INGRESAR EMAIL ========== */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h2>
              <p className="text-gray-600">No te preocupes, te enviaremos un código para restablecerla</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                'Enviar código'
              )}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </button>
          </div>
        )}

        {/* ========== PASO 2: VERIFICAR CÓDIGO ========== */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifica tu email</h2>
              <p className="text-gray-600">
                Enviamos un código de 6 dígitos a<br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Ingresa el código
              </label>
              <div className="flex gap-2 justify-center">
                {codigo.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodigoChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodigoKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleVerifyCode}
              disabled={loading || codigo.join('').length !== 6}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                'Verificar código'
              )}
            </button>

            <div className="text-center">
              <button
                onClick={handleSendCode}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cambiar email
            </button>
          </div>
        )}

        {/* ========== PASO 3: NUEVA CONTRASEÑA ========== */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear nueva contraseña</h2>
              <p className="text-gray-600">Tu nueva contraseña debe ser diferente a las anteriores</p>
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Confirma tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Requisitos de Contraseña */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Tu contraseña debe tener:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${passwordRequirements.minLength ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={passwordRequirements.minLength ? 'text-green-700' : 'text-gray-600'}>
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${passwordRequirements.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={passwordRequirements.hasUpperCase ? 'text-green-700' : 'text-gray-600'}>
                    Una letra mayúscula
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={passwordRequirements.hasNumber ? 'text-green-700' : 'text-gray-600'}>
                    Un número
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${passwordRequirements.hasSpecial ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={passwordRequirements.hasSpecial ? 'text-green-700' : 'text-gray-600'}>
                    Un carácter especial
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading || !allRequirementsMet || newPassword !== confirmPassword}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Cambiando contraseña...</span>
                </div>
              ) : (
                'Cambiar contraseña'
              )}
            </button>
          </div>
        )}

        {/* ========== PASO 4: ÉXITO ========== */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Contraseña cambiada!</h2>
              <p className="text-gray-600 mb-4">
                Tu contraseña ha sido actualizada exitosamente
              </p>
              <p className="text-sm text-gray-500">
                Serás redirigido al inicio de sesión en 3 segundos...
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
            >
              Ir al inicio de sesión
            </button>
          </div>
        )}

      </div>
    </div>
  );
};