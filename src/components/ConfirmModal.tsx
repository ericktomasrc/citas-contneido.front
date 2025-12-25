import { CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isLoading: boolean;
  isSuccess: boolean;
  onClose: () => void;
}

export const ConfirmModal = ({ isLoading, isSuccess, onClose }: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
        {/* Estado: Cargando */}
        {isLoading && (
          <>
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Completando Registro...
            </h2>
            
            <p className="text-gray-600">
              Estamos procesando tu información. Por favor espera un momento.
            </p>
            
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </>
        )}

        {/* Estado: Éxito */}
        {isSuccess && (
          <>
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scale-in">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Registro Completado!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido creada exitosamente. Serás redirigido al dashboard en unos segundos.
            </p>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg"
            >
              Ir al Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};