import { CreatorProfile } from '../../../../shared/types/creator-profile.types';

interface ProfileAboutProps {
  profile: CreatorProfile;
}

export const ProfileAbout = ({ profile }: ProfileAboutProps) => {
  return (
    <div className="px-6 py-6 bg-white border-b border-gray-200">
      {/* Bio */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Sobre mí
        </h3>
        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
      </div>

      {/* Intereses */}
      {profile.intereses && profile.intereses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Intereses
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.intereses.map((interes, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                {interes}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detalles */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Detalles
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {profile.cumpleanos && (
            <div>
              <div className="text-gray-500 mb-1">Edad</div>
              <div className="text-gray-900 font-medium">{profile.edad} años</div>
            </div>
          )}
          {profile.altura && (
            <div>
              <div className="text-gray-500 mb-1">Altura</div>
              <div className="text-gray-900 font-medium">{profile.altura}m</div>
            </div>
          )}
          {profile.educacion && (
            <div>
              <div className="text-gray-500 mb-1">Educación</div>
              <div className="text-gray-900 font-medium">{profile.educacion}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};