import React, { useState } from 'react';
import ShoppingMascot from '../components/common/ShoppingMascot';

const ShoppingMascotDemo = () => {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedAnimation, setSelectedAnimation] = useState('knock');
  const [showText, setShowText] = useState(true);

  const sizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ];

  const animations = [
    { value: 'knock', label: 'Knock Animation' },
    { value: 'carry', label: 'Carry Bags' },
    { value: 'bounce', label: 'Bounce' }
  ];

  const messages = [
    'Loading SNAFLES Hub...',
    'Getting your shopping ready...',
    'Preparing amazing deals...',
    'Loading your cart...',
    'Finding the best products...'
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  const cycleMessage = () => {
    setCurrentMessage((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛍️ Shopping Mascot Demo
          </h1>
          <p className="text-gray-600 text-lg">
            Meet our cute shopping mascot! Watch it carry bags, knock playfully, and bring joy to your loading experience.
          </p>
        </div>

        {/* Main Demo Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mascot Display */}
            <div className="flex-1 flex items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <ShoppingMascot 
                size={selectedSize}
                message={messages[currentMessage]}
                showText={showText}
                animationType={selectedAnimation}
              />
            </div>

            {/* Controls */}
            <div className="lg:w-80 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customize Your Mascot</h3>
              
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size.value
                          ? 'bg-navy-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                <div className="space-y-2">
                  {animations.map((animation) => (
                    <button
                      key={animation.value}
                      onClick={() => setSelectedAnimation(animation.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedAnimation === animation.value
                          ? 'bg-navy-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {animation.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Toggle */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showText}
                    onChange={(e) => setShowText(e.target.checked)}
                    className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Loading Text</span>
                </label>
              </div>

              {/* Message Cycling */}
              <div>
                <button
                  onClick={cycleMessage}
                  className="w-full btn btn-outline"
                >
                  Change Message
                </button>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Current: "{messages[currentMessage]}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl mb-3">🛍️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Shopping Bags</h3>
            <p className="text-gray-600 text-sm">
              Cute little shopping bags that swing as the mascot moves, creating a playful shopping atmosphere.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl mb-3">👋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Knock Animation</h3>
            <p className="text-gray-600 text-sm">
              Playful knock gesture that shows the mascot is actively working to load your content.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl mb-3">😊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Friendly Design</h3>
            <p className="text-gray-600 text-sm">
              Cute, friendly robot design with blinking eyes and a smile that makes waiting fun.
            </p>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Loading States</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <ShoppingMascot size="small" message="Loading..." showText={false} />
                  <span className="text-sm text-gray-600">Small loading indicator</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <ShoppingMascot size="medium" message="Processing..." showText={true} />
                  <span className="text-sm text-gray-600">Medium with text</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Different Animations</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <ShoppingMascot size="small" animationType="knock" showText={false} />
                  <span className="text-sm text-gray-600">Knock animation</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <ShoppingMascot size="small" animationType="carry" showText={false} />
                  <span className="text-sm text-gray-600">Carry bags animation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingMascotDemo;
