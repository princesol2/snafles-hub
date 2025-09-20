import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('main.jsx starting...')
console.log('React version:', React.version)

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

if (!rootElement) {
  console.error('Root element not found!')
} else {
  console.log('Creating React root...')
  const root = ReactDOM.createRoot(rootElement)
  
  console.log('Rendering App component...')
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('App component rendered!')
}
