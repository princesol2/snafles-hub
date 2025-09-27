import React from 'react';

const ShoppingMascot = ({ 
  size = 'medium', 
  message = 'Loading...', 
  showText = true,
  animationType = 'knock' // 'knock', 'carry', 'bounce'
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Shopping Mascot */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Shopping Bags */}
        <div className="absolute -left-2 -top-1 animate-swing-bags">
          <div className="w-3 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-sm transform rotate-12 shadow-sm">
            <div className="w-2 h-1 bg-blue-400 rounded-full mx-auto mt-0.5"></div>
          </div>
        </div>
        
        <div className="absolute -right-2 -top-1 animate-swing-bags-reverse">
          <div className="w-3 h-4 bg-gradient-to-b from-green-500 to-green-600 rounded-sm transform -rotate-12 shadow-sm">
            <div className="w-2 h-1 bg-green-400 rounded-full mx-auto mt-0.5"></div>
          </div>
        </div>

        {/* Main Mascot Body */}
        <div className={`relative ${sizeClasses[size]} mx-auto`}>
          {/* Head */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full shadow-md animate-head-bounce">
            {/* Eyes */}
            <div className="absolute top-2 left-1.5 w-1.5 h-1.5 bg-black rounded-full animate-blink"></div>
            <div className="absolute top-2 right-1.5 w-1.5 h-1.5 bg-black rounded-full animate-blink"></div>
            
            {/* Smile */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1.5 border-b-2 border-black rounded-full"></div>
            
            {/* Antenna */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-500">
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Body */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg shadow-md animate-body-sway">
            {/* Arms */}
            <div className="absolute top-1 -left-2 w-2 h-6 bg-blue-400 rounded-full transform rotate-12 animate-arm-knock"></div>
            <div className="absolute top-1 -right-2 w-2 h-6 bg-blue-400 rounded-full transform -rotate-12 animate-arm-knock-reverse"></div>
            
            {/* Chest */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-blue-300 rounded-md">
              <div className="w-1 h-1 bg-white rounded-full absolute top-1 left-1"></div>
              <div className="w-1 h-1 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>

          {/* Legs */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-3 h-4 bg-blue-500 rounded-full animate-leg-walk"></div>
            <div className="w-3 h-4 bg-blue-500 rounded-full animate-leg-walk-reverse"></div>
          </div>

          {/* Knock Effect */}
          {animationType === 'knock' && (
            <div className="absolute -right-8 top-4 animate-knock-effect">
              <div className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          {/* Loading Dots */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="text-center">
          <p className={`font-semibold text-gray-700 ${textSizes[size]} animate-pulse`}>
            {message}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Getting your shopping ready...
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingMascot;
