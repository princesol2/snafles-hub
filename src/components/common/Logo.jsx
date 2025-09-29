import React from 'react';

const Logo = ({ size = 'default', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'text-lg',
          snafles: 'text-lg',
          hu: 'text-sm',
          shopIcon: 'w-4 h-4',
          cartIcon: 'w-3 h-3'
        };
      case 'large':
        return {
          container: 'text-4xl',
          snafles: 'text-4xl',
          hu: 'text-2xl',
          shopIcon: 'w-8 h-8',
          cartIcon: 'w-6 h-6'
        };
      case 'xl':
        return {
          container: 'text-5xl',
          snafles: 'text-5xl',
          hu: 'text-3xl',
          shopIcon: 'w-10 h-10',
          cartIcon: 'w-8 h-8'
        };
      default:
        return {
          container: 'text-2xl',
          snafles: 'text-2xl',
          hu: 'text-lg',
          shopIcon: 'w-6 h-6',
          cartIcon: 'w-5 h-5'
        };
    }
  };

  const sizes = getSizeClasses();

  return (
    <div className={`flex flex-col items-center font-bold ${sizes.container} ${className}`}>
      {/* Snafles Text */}
      <div className={`${sizes.snafles} text-blue-800 font-bold`}>
        <span className="relative">
          Snafles
          {/* Stylized 'a' with smiling face */}
          <span className="absolute -top-1 left-0 w-full h-full">
            <span className="absolute top-1 left-1 w-1 h-1 bg-blue-800 rounded-full"></span>
            <span className="absolute top-1 left-2 w-1 h-1 bg-blue-800 rounded-full"></span>
            <span className="absolute top-2 left-1.5 w-2 h-0.5 bg-blue-800 rounded-full opacity-60"></span>
          </span>
        </span>
      </div>
      
      {/* Hu! with Icons */}
      <div className="flex items-center space-x-1">
        {/* Shop Icon */}
        <div className={`${sizes.shopIcon} text-orange-500`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            {/* Shop/Stall with awning */}
            <path d="M2 8h20v12H2z" fill="currentColor" opacity="0.8"/>
            <path d="M1 8h22l-1-2H2z" fill="currentColor"/>
            <path d="M8 8v8h2V8H8z" fill="currentColor" opacity="0.6"/>
            <path d="M14 8v8h2V8h-2z" fill="currentColor" opacity="0.6"/>
            {/* Awning scallops */}
            <path d="M0 6h2v2H0z" fill="currentColor"/>
            <path d="M3 6h2v2H3z" fill="currentColor"/>
            <path d="M6 6h2v2H6z" fill="currentColor"/>
            <path d="M9 6h2v2H9z" fill="currentColor"/>
            <path d="M12 6h2v2h-2z" fill="currentColor"/>
            <path d="M15 6h2v2h-2z" fill="currentColor"/>
            <path d="M18 6h2v2h-2z" fill="currentColor"/>
            <path d="M21 6h2v2h-2z" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Hu Text */}
        <span className={`${sizes.hu} text-orange-500 font-bold`}>Hu</span>
        
        {/* Shopping Cart Icon (replaces the !) */}
        <div className={`${sizes.cartIcon} text-blue-600`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            {/* Cart body */}
            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="currentColor"/>
            {/* Cart wheels */}
            <circle cx="8" cy="20" r="1" fill="#f97316"/>
            <circle cx="16" cy="20" r="1" fill="#f97316"/>
            {/* Cart handle */}
            <path d="M6 2H4V4H6V2Z" fill="currentColor" opacity="0.6"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Logo;
