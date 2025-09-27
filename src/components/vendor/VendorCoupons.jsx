import React, { useState } from 'react'
import { Percent, Plus, Trash2 } from 'lucide-react'

const VendorCoupons = () => {
  const [coupons, setCoupons] = useState([
    { code: 'NEW10', type: 'percent', value: 10, uses: 34, maxUses: 100, active: true, expiresAt: '2024-03-31' },
    { code: 'FEST200', type: 'flat', value: 200, uses: 12, maxUses: 50, active: true, expiresAt: '2024-02-29' },
  ])
  const [form, setForm] = useState({ code: '', type: 'percent', value: 10, maxUses: 100, expiresAt: '' })

  const addCoupon = (e) => {
    e.preventDefault()
    if (!form.code) return
    setCoupons([{ ...form, uses: 0, active: true }, ...coupons])
    setForm({ code: '', type: 'percent', value: 10, maxUses: 100, expiresAt: '' })
  }

  const deleteCoupon = (code) => setCoupons(coupons.filter(c => c.code !== code))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Discounts & Coupons</h3>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={addCoupon}>
          <input
            required
            placeholder="Code (e.g. NEW10)"
            className="px-3 py-2 border rounded-lg"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          />
          <select className="px-3 py-2 border rounded-lg" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="percent">Percent %</option>
            <option value="flat">Flat Amount</option>
          </select>
          <input type="number" className="px-3 py-2 border rounded-lg" value={form.value} min={1} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          <input type="number" className="px-3 py-2 border rounded-lg" value={form.maxUses} min={1} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} />
          <div className="flex gap-2">
            <input type="date" className="flex-1 px-3 py-2 border rounded-lg" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map(c => (
              <tr key={c.code}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.code}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{c.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{c.uses}/{c.maxUses}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.expiresAt || '-'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteCoupon(c.code)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VendorCoupons

