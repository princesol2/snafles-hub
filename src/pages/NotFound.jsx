import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft">
      <div className="text-center p-8 card">
        <h1 className="heading-2 mb-4">Page not found</h1>
        <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/products" className="btn btn-outline">Browse Products</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound

