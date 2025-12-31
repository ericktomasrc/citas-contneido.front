import { useState } from 'react';

export const PrivacyTab = () => {
  const [privacy, setPrivacy] = useState({
    perfilPublico: true,
    mostrarUbicacion: true,
    mostrarEnLinea: true,
    permitirMensajes: true,
    mostrarEnBusqueda: true,
  });

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        enabled ? 'bg-gradient-to-r from-pink-500 to-rose-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-2xl space-y-6">
      {/* Perfil Público */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Perfil público
            </h3>
            <p className="text-sm text-gray-600">
              Permite que otros usuarios vean tu perfil completo
            </p>
          </div>
          <Toggle
            enabled={privacy.perfilPublico}
            onChange={() => setPrivacy({ ...privacy, perfilPublico: !privacy.perfilPublico })}
          />
        </div>
      </div>

      {/* Mostrar Ubicación */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Mostrar ubicación
            </h3>
            <p className="text-sm text-gray-600">
              Permite que otros vean tu ciudad y distancia aproximada
            </p>
          </div>
          <Toggle
            enabled={privacy.mostrarUbicacion}
            onChange={() => setPrivacy({ ...privacy, mostrarUbicacion: !privacy.mostrarUbicacion })}
          />
        </div>
      </div>

      {/* Estado en línea */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Mostrar estado en línea
            </h3>
            <p className="text-sm text-gray-600">
              Permite que otros vean cuándo estás conectado
            </p>
          </div>
          <Toggle
            enabled={privacy.mostrarEnLinea}
            onChange={() => setPrivacy({ ...privacy, mostrarEnLinea: !privacy.mostrarEnLinea })}
          />
        </div>
      </div>

      {/* Permitir mensajes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Permitir mensajes
            </h3>
            <p className="text-sm text-gray-600">
              Permite que usuarios te envíen mensajes directos
            </p>
          </div>
          <Toggle
            enabled={privacy.permitirMensajes}
            onChange={() => setPrivacy({ ...privacy, permitirMensajes: !privacy.permitirMensajes })}
          />
        </div>
      </div>

      {/* Aparecer en búsqueda */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Aparecer en búsqueda
            </h3>
            <p className="text-sm text-gray-600">
              Permite que otros usuarios te encuentren en búsquedas
            </p>
          </div>
          <Toggle
            enabled={privacy.mostrarEnBusqueda}
            onChange={() => setPrivacy({ ...privacy, mostrarEnBusqueda: !privacy.mostrarEnBusqueda })}
          />
        </div>
      </div>

      {/* Botón Guardar */}
      <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition">
        Guardar Configuración
      </button>
    </div>
  );
};
