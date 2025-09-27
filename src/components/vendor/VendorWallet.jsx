import React, { useState } from 'react'
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

const VendorWallet = () => {
  const [balance, setBalance] = useState(42000)
  const [history, setHistory] = useState([
    { id: 'W-001', type: 'credit', amount: 15000, note: 'Order settlements', date: '2024-01-14' },
    { id: 'W-002', type: 'debit', amount: 5000, note: 'Payout to bank', date: '2024-01-12' },
    { id: 'W-003', type: 'credit', amount: 32000, note: 'Order settlements', date: '2024-01-10' },
  ])

  const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vendor Wallet</h3>
        <div className="text-2xl font-bold text-navy-600">{formatCurrency(balance)}</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4" /> Add Funds
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4" /> Withdraw
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h4 className="text-lg font-medium text-gray-900">Wallet History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map(h => (
                <tr key={h.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{h.id}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${h.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {h.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(h.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{h.note}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VendorWallet

