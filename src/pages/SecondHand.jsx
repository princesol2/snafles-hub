import { useEffect, useState } from 'react'
import { secondhandAPI } from '../services/api'
import { Link } from 'react-router-dom'

const SecondHand = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    load()
  }, [category])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (category !== 'all') params.category = category
      const res = await secondhandAPI.getProducts(params)
      setItems(res.products || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all','Jewelry','Decor','Clothing','Accessories','Home','Art']

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Second-Hand Products</h1>
          <p className="text-gray-600">Browse preloved items submitted by our community</p>
        </div>
        <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(p => (
            <Link to={`/product/${p._id}`} key={p._id} className="relative bg-white rounded-lg shadow-sm border hover:shadow-md transition">
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                Pre‑Loved
              </div>
              <img src={Array.isArray(p.images) ? p.images[0] : p.image} alt={p.name} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
                <p className="text-sm text-gray-500">Condition: {p.condition?.replace('_',' ') || 'good'}</p>
                <div className="mt-2 font-bold">₹{(p.price||0).toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SecondHand
