import React from 'react'

const Test = () => {
  console.log('Test component rendering...')
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">🎉 SNAFLEShub Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this, React is working!</p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-green-600 font-semibold">✅ React is rendering</p>
          <p className="text-green-600 font-semibold">✅ Tailwind CSS is working</p>
          <p className="text-green-600 font-semibold">✅ Components are loading</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  )
}

export default Test
