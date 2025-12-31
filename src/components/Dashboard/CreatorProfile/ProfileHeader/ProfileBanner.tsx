interface ProfileBannerProps {
  imageUrl: string;
}

export const ProfileBanner = ({ imageUrl }: ProfileBannerProps) => {
  return (
    <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Imagen con blur */}
      <img
        src={imageUrl}
        alt="Banner"
        className="w-full h-full object-cover"
        style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
      />
      
      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white" />
    </div>
  );
};