// components/LGBTIcon.tsx
export const LGBTIcon = ({ className = "w-6 h-6" }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#E40303', stopOpacity: 1 }} />
          <stop offset="16.67%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
          <stop offset="33.33%" style={{ stopColor: '#FFED00', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#008026', stopOpacity: 1 }} />
          <stop offset="66.67%" style={{ stopColor: '#24408E', stopOpacity: 1 }} />
          <stop offset="83.33%" style={{ stopColor: '#732982', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#rainbow)" />
      <circle cx="12" cy="12" r="6" fill="white" />
      <path 
        d="M12 8L14 14L10 14Z" 
        fill="url(#rainbow)" 
        transform="rotate(45 12 12)"
      />
    </svg>
  );
};