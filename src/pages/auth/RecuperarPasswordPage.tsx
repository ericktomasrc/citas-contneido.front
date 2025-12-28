import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, CheckCircle, Eye, EyeOff, Shield, AlertCircle, Send, KeyRound } from 'lucide-react';
import { restablecerPassword, solicitarRecuperacionPassword, verificarCodigoRecuperacion } from '@/shared/api/authApi';

export const RecuperarPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Nueva Password, 4: Éxito
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
    if (!/^\d*$/.test(value)) return;

    const newCodigo = [...codigo];
    newCodigo[index] = value.slice(0, 1);
    setCodigo(newCodigo);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step >= s
                    ? 'w-12 bg-gradient-to-r from-pink-500 to-purple-500'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ========== PASO 1: INGRESAR EMAIL ========== */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-gray-600">
                  No te preocupes, te enviaremos un código para restablecerla
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition outline-none"
                    placeholder="tu@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar código</span>
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </button>
            </motion.div>
          )}

          {/* ========== PASO 2: VERIFICAR CÓDIGO ========== */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verifica tu email
                </h2>
                <p className="text-gray-600 mb-1">
                  Enviamos un código de 6 dígitos a
                </p>
                <p className="text-lg font-semibold text-pink-600">{email}</p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
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
                      disabled={loading}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyCode}
                disabled={loading || codigo.join('').length !== 6}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    <span>Verificar código</span>
                  </>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center mb-4">
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="text-sm text-pink-600 hover:text-pink-700 font-semibold transition disabled:opacity-50"
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Cambiar email
              </button>
            </motion.div>
          )}

          {/* ========== PASO 3: NUEVA CONTRASEÑA ========== */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Crear nueva contraseña
                </h2>
                <p className="text-gray-600">
                  Tu nueva contraseña debe ser diferente a las anteriores
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Nueva Contraseña */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition outline-none"
                    placeholder="Ingresa tu nueva contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition outline-none"
                    placeholder="Confirma tu nueva contraseña"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Requisitos de Contraseña */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Tu contraseña debe tener:
                </p>
                <div className="space-y-2">
                  {[
                    { key: 'minLength', label: 'Mínimo 8 caracteres' },
                    { key: 'hasUpperCase', label: 'Una letra mayúscula' },
                    { key: 'hasNumber', label: 'Un número' },
                    { key: 'hasSpecial', label: 'Un carácter especial' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                          passwordRequirements[key as keyof typeof passwordRequirements]
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        {passwordRequirements[key as keyof typeof passwordRequirements] && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span
                        className={`text-sm transition ${
                          passwordRequirements[key as keyof typeof passwordRequirements]
                            ? 'text-green-700 font-medium'
                            : 'text-gray-600'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleResetPassword}
                disabled={loading || !allRequirementsMet || newPassword !== confirmPassword}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Cambiando contraseña...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Cambiar contraseña</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ========== PASO 4: ÉXITO ========== */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            >
              <div className="text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  ¡Contraseña cambiada!
                </h2>
                <p className="text-gray-600 mb-2">
                  Tu contraseña ha sido actualizada exitosamente
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Serás redirigido al inicio de sesión en 3 segundos...
                </p>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Ir al inicio de sesión
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};