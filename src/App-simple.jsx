import React from 'react'

function App() {
  console.log('Simple App component rendering...')
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          color: '#e75480', 
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          🎉 SNAFLEShub
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#6b7280', 
          marginBottom: '2rem' 
        }}>
          React is working! This is a simple test.
        </p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0.5rem 0' }}>
            ✅ React is rendering
          </p>
          <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0.5rem 0' }}>
            ✅ JavaScript is working
          </p>
          <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0.5rem 0' }}>
            ✅ Basic styling works
          </p>
        </div>
        <button 
          onClick={() => {
            console.log('Button clicked!')
            alert('Button works!')
          }}
          style={{
            marginTop: '1rem',
            backgroundColor: '#e75480',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  )
}

export default App
