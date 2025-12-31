import { useState } from 'react';

export const NotificationsTab = () => {
  const [notifications, setNotifications] = useState({
    nuevoMensaje: true,
    nuevaSuscripcion: true,
    invitacionAceptada: true,
    nuevoLike: false,
    nuevoSeguidor: true,
    comentarioEnContenido: true,
    liveIniciado: true,
    recordatorioRenovacion: true,
    notificacionesEmail: true,
    notificacionesPush: true,
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Notificaciones de la aplicación
        </h3>
        <p className="text-sm text-gray-600">
          Configura qué notificaciones quieres recibir
        </p>
      </div>

      {/* Nuevo mensaje */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Nuevos mensajes
            </h4>
            <p className="text-sm text-gray-600">
              Cuando recibas un nuevo mensaje directo
            </p>
          </div>
          <Toggle
            enabled={notifications.nuevoMensaje}
            onChange={() => setNotifications({ ...notifications, nuevoMensaje: !notifications.nuevoMensaje })}
          />
        </div>
      </div>

      {/* Nueva suscripción */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Nuevas suscripciones
            </h4>
            <p className="text-sm text-gray-600">
              Cuando alguien se suscriba a tu contenido
            </p>
          </div>
          <Toggle
            enabled={notifications.nuevaSuscripcion}
            onChange={() => setNotifications({ ...notifications, nuevaSuscripcion: !notifications.nuevaSuscripcion })}
          />
        </div>
      </div>

      {/* Invitación aceptada */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Invitaciones aceptadas
            </h4>
            <p className="text-sm text-gray-600">
              Cuando alguien acepte tu invitación de contacto
            </p>
          </div>
          <Toggle
            enabled={notifications.invitacionAceptada}
            onChange={() => setNotifications({ ...notifications, invitacionAceptada: !notifications.invitacionAceptada })}
          />
        </div>
      </div>

      {/* Nuevo like */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Nuevos likes
            </h4>
            <p className="text-sm text-gray-600">
              Cuando alguien le dé like a tu contenido
            </p>
          </div>
          <Toggle
            enabled={notifications.nuevoLike}
            onChange={() => setNotifications({ ...notifications, nuevoLike: !notifications.nuevoLike })}
          />
        </div>
      </div>

      {/* Nuevo seguidor */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Nuevos seguidores
            </h4>
            <p className="text-sm text-gray-600">
              Cuando alguien te empiece a seguir
            </p>
          </div>
          <Toggle
            enabled={notifications.nuevoSeguidor}
            onChange={() => setNotifications({ ...notifications, nuevoSeguidor: !notifications.nuevoSeguidor })}
          />
        </div>
      </div>

      {/* Comentario en contenido */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Comentarios
            </h4>
            <p className="text-sm text-gray-600">
              Cuando alguien comente en tu contenido
            </p>
          </div>
          <Toggle
            enabled={notifications.comentarioEnContenido}
            onChange={() => setNotifications({ ...notifications, comentarioEnContenido: !notifications.comentarioEnContenido })}
          />
        </div>
      </div>

      {/* Live iniciado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Lives iniciados
            </h4>
            <p className="text-sm text-gray-600">
              Cuando una creadora que sigues inicie un live
            </p>
          </div>
          <Toggle
            enabled={notifications.liveIniciado}
            onChange={() => setNotifications({ ...notifications, liveIniciado: !notifications.liveIniciado })}
          />
        </div>
      </div>

      {/* Recordatorio de renovación */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Recordatorios de renovación
            </h4>
            <p className="text-sm text-gray-600">
              Cuando una suscripción esté por renovarse
            </p>
          </div>
          <Toggle
            enabled={notifications.recordatorioRenovacion}
            onChange={() => setNotifications({ ...notifications, recordatorioRenovacion: !notifications.recordatorioRenovacion })}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Canales de notificación
        </h3>
      </div>

      {/* Notificaciones por email */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Notificaciones por email
            </h4>
            <p className="text-sm text-gray-600">
              Recibir notificaciones en tu correo electrónico
            </p>
          </div>
          <Toggle
            enabled={notifications.notificacionesEmail}
            onChange={() => setNotifications({ ...notifications, notificacionesEmail: !notifications.notificacionesEmail })}
          />
        </div>
      </div>

      {/* Notificaciones push */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Notificaciones push
            </h4>
            <p className="text-sm text-gray-600">
              Recibir notificaciones en tu dispositivo
            </p>
          </div>
          <Toggle
            enabled={notifications.notificacionesPush}
            onChange={() => setNotifications({ ...notifications, notificacionesPush: !notifications.notificacionesPush })}
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
