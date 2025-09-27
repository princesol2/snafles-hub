import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import toast from 'react-hot-toast'

const AdminControls = () => {
  const [vendors, setVendors] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const [newVendor, setNewVendor] = useState({
    name: '', description: '', location: '', logo: '', banner: '', contact: { email: '' }
  })

  const loadAll = async () => {
    setLoading(true)
    try {
      const [v, u, p] = await Promise.all([
        api.get('/vendors?limit=50'),
        api.get('/users?limit=50'),
        api.get('/products?limit=50')
      ])
      setVendors(v.data.vendors || v.data || [])
      setUsers(u.data.users || u.data || [])
      setProducts(p.data.products || p.data || [])
    } catch (e) {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const createVendor = async () => {
    try {
      await api.post('/vendors', newVendor)
      toast.success('Vendor created')
      setNewVendor({ name: '', description: '', location: '', logo: '', banner: '', contact: { email: '' } })
      loadAll()
    } catch (e) {
      toast.error(e?.message || 'Failed to create vendor')
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => (u.id || u._id) !== id))
    } catch (e) {
      toast.error(e?.message || 'Failed to delete user')
    }
  }

  const setUserActive = async (id, active) => {
    try {
      await api.put(`/users/${id}/status`, { isActive: active })
      toast.success('Status updated')
      setUsers(prev => prev.map(u => (u.id||u._id)===id ? { ...u, isActive: active } : u))
    } catch (e) {
      toast.error(e?.message || 'Failed to update status')
    }
  }

  const approveProduct = async (id, approved) => {
    try {
      await api.put(`/products/${id}/approve`, { approved })
      toast.success(approved ? 'Product approved' : 'Product unapproved')
      setProducts(prev => prev.map(p => (p.id||p._id)===id ? { ...p, approved } : p))
    } catch (e) {
      toast.error(e?.message || 'Failed to update product')
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border p-6">
        <h4 className="text-lg font-semibold mb-4">Add Vendor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" placeholder="Name" value={newVendor.name} onChange={e=>setNewVendor(v=>({...v, name:e.target.value}))} />
          <input className="input" placeholder="Location" value={newVendor.location} onChange={e=>setNewVendor(v=>({...v, location:e.target.value}))} />
          <input className="input" placeholder="Logo URL" value={newVendor.logo} onChange={e=>setNewVendor(v=>({...v, logo:e.target.value}))} />
          <input className="input" placeholder="Banner URL" value={newVendor.banner} onChange={e=>setNewVendor(v=>({...v, banner:e.target.value}))} />
          <input className="input md:col-span-2" placeholder="Contact Email" value={newVendor.contact.email} onChange={e=>setNewVendor(v=>({...v, contact:{...v.contact, email:e.target.value}}))} />
          <textarea className="input md:col-span-2" placeholder="Description" value={newVendor.description} onChange={e=>setNewVendor(v=>({...v, description:e.target.value}))} />
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={createVendor} className="btn btn-primary">Create Vendor</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold mb-4">Users</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {users.map(u => (
              <div key={u.id||u._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={()=>setUserActive(u.id||u._id, !(u.isActive!==false))} className="btn btn-outline text-xs px-3 py-1">{u.isActive===false ? 'Activate' : 'Suspend'}</button>
                  <button onClick={()=>deleteUser(u.id||u._id)} className="btn btn-ghost text-red-600 text-xs px-3 py-1">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold mb-4">Vendors</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {vendors.map(v => (
              <div key={v.id||v._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{v.name}</div>
                  <div className="text-xs text-gray-500">{v.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold mb-4">Products</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {products.map(p => (
              <div key={p.id||p._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">₹{(p.price||0).toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={()=>approveProduct(p.id||p._id, true)} className="btn btn-outline text-xs px-3 py-1">Approve</button>
                  <button onClick={()=>approveProduct(p.id||p._id, false)} className="btn btn-ghost text-xs px-3 py-1">Unapprove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading...</div>}
    </div>
  )
}

export default AdminControls

