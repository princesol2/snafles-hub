import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Calendar, Users, MessageSquare, Eye } from 'lucide-react'
import { useProducts } from '../contexts/ProductContext'

const Vendors = () => {
  const { vendors, loading } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Vendors</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented artisans and creators who make SNAFLEShub special
          </p>
        </div>

        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              to={`/vendor/${vendor.id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={vendor.banner}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <img
                    src={vendor.logo}
                    alt={`${vendor.name} logo`}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{vendor.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{vendor.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{vendor.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.floor(vendor.rating || 4) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <Link
                      to={`/reviews/vendor/${vendor.id}`}
                      className="text-sm text-primary hover:text-primary/80 ml-2 font-medium"
                    >
                      ({vendor.reviews} reviews)
                    </Link>
                  </div>
                  <div className="text-sm text-gray-500">
                    {vendor.products?.length || 0} products
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/vendor/${vendor.id}`}
                    className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to={`/reviews/vendor/${vendor.id}`}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews</span>
                  </Link>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Vendors
