import React, { useEffect, useState } from 'react'
import { DollarSign, CreditCard, Download, Receipt, Calendar } from 'lucide-react'

const VendorPayments = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 125000,
    pendingPayout: 22000,
    completedPayouts: 103000,
    refunds: 1500
  })
  const [payouts, setPayouts] = useState([
    { id: 'P-001', amount: 25000, date: '2024-01-10', status: 'completed', method: 'Bank Transfer' },
    { id: 'P-002', amount: 18000, date: '2024-01-03', status: 'completed', method: 'UPI' },
    { id: 'P-003', amount: 22000, date: '2024-01-17', status: 'pending', method: 'Bank Transfer' },
  ])
  const [transactions, setTransactions] = useState([
    { id: 'T-1001', orderId: 'ORD-001', date: '2024-01-15', amount: 5998, fee: 300, status: 'settled' },
    { id: 'T-1002', orderId: 'ORD-002', date: '2024-01-14', amount: 2499, fee: 125, status: 'settled' },
    { id: 'T-1003', orderId: 'ORD-003', date: '2024-01-13', amount: 8997, fee: 450, status: 'settled' },
  ])

  const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Payments & Payouts</h3>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[{
          label: 'Total Revenue', value: summary.totalRevenue, icon: DollarSign, color: 'bg-green-500'
        }, {
          label: 'Pending Payout', value: summary.pendingPayout, icon: CreditCard, color: 'bg-yellow-500'
        }, {
          label: 'Completed Payouts', value: summary.completedPayouts, icon: Receipt, color: 'bg-blue-500'
        }, {
          label: 'Refunds', value: summary.refunds, icon: Receipt, color: 'bg-red-500'
        }].map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(s.value)}</p>
              </div>
              <div className={`p-3 rounded-full ${s.color}`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payouts */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between p-6 border-b">
          <h4 className="text-lg font-medium text-gray-900">Payouts</h4>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Request Payout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h4 className="text-lg font-medium text-gray-900">Transactions</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map(t => (
                <tr key={t.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{t.orderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(t.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(t.fee)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${t.status === 'settled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VendorPayments

