import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Sparkles, UserPlus } from 'lucide-react';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { authApi } from '@features/auth/api/authApi';

export const RegisterLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.registrarEmail({ email });
      
      if (response.message?.startsWith('CONTINUAR_REGISTRO')) {
        const userId = response.message.split('|')[1];
        const registrationData = {
          userId: userId,
          timestamp: Date.now(),
          email: email
        };
        localStorage.setItem('temp_registration', JSON.stringify(registrationData));
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

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-md w-full bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20"
        >
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Correo enviado!
            </h2>
            
            <p className="text-gray-600 mb-2">
              Hemos enviado un enlace de verificación a
            </p>
            <p className="text-lg font-semibold text-pink-600 mb-6">{email}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                Por favor revisa tu correo (también en spam) y haz clic en el enlace para continuar.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Form
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
        {/* Botón volver */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al inicio</span>
        </button>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">C</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CitasContenido
          </h1>
          
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Crea tu cuenta y comienza
          </p>
        </motion.div>

        {/* Card Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OAuth Buttons */}
          <OAuthButtons 
            onError={setError}
            onSuccess={() => navigate('/dashboard')}
          />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">o continúa con email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailRegister} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition outline-none"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Crear cuenta</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold text-pink-600 hover:text-pink-700 transition"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Al continuar, aceptas nuestros{' '}
          <a href="/terminos" className="font-medium text-pink-600 hover:text-pink-700">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="/privacidad" className="font-medium text-pink-600 hover:text-pink-700">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
};