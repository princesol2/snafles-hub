import { Link } from 'react-router-dom'
import { useProducts } from '../../contexts/ProductContext'

const RelatedProducts = ({ product, max = 8 }) => {
  const { products } = useProducts()

  if (!product) return null

  const related = products
    .filter(p => (p.id || p._id) !== product.id)
    .filter(p => p.category === product.category || (p.vendor && product.vendor && (typeof p.vendor === 'object' ? (p.vendor.id || p.vendor._id) : p.vendor) === (typeof product.vendor === 'object' ? (product.vendor.id || product.vendor._id) : product.vendor)))
    .slice(0, max)

  if (related.length === 0) return null

  return (
    <div className="mt-16">
      <h3 className="heading-3 mb-6">Related Products</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map(item => (
          <Link key={item.id || item._id} to={`/product/${item.id || item._id}`} className="group block bg-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <img src={item.image || item.images?.[0] || '/placeholder-product.jpg'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.src = '/placeholder-product.jpg' }} />
            </div>
            <div className="p-3">
              <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
              <div className="text-sm text-primary mt-1">₹{(item.price || 0).toLocaleString()}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts

