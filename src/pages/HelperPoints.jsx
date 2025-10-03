import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { helperPointsAPI } from '../services/api';
import { Award } from 'lucide-react';
import toast from 'react-hot-toast';

const HelperPointsPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ balance: 0, totalOutstanding: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  // Manual top-ups are disabled; points are earned via actions

  const load = async () => {
    setLoading(true);
    try {
      const s = await helperPointsAPI.getSummary();
      const t = await helperPointsAPI.getTransactions(50);
      setSummary(s);
      setTransactions(t.transactions || []);
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Failed to load Helper Points');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // No direct add; show guidance in UI instead of a form

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Helper Points</h1>
                <p className="text-sm text-gray-600">Community-powered assistance for smooth checkout</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Your Balance</h3>
              <div className="text-3xl font-bold text-orange-600">{summary.balance}</div>
              <div className="text-sm text-gray-500 mt-1">Helper Points</div>
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                <p className="text-sm text-orange-800">
                  Helper Points are earned by assisting others — not added manually.
                  Help fulfill community requests, repay on time, refer friends, and keep your profile active to earn.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Outstanding Help Used</h3>
              <div className="text-2xl font-bold text-gray-900">?{summary.totalOutstanding?.toLocaleString?.() || summary.totalOutstanding}</div>
              <p className="text-sm text-gray-500">Automatically reimbursed when you top up your wallet.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How To Earn Points</h3>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Help others complete purchases via the assistance network</li>
                <li>Maintain on-time repayments on assistance you received</li>
                <li>Refer friends who complete their first purchase</li>
                <li>Complete your profile and stay active</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Transactions</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {transactions.length === 0 && (
                <div className="text-sm text-gray-500">No transactions yet.</div>
              )}
              {transactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 capitalize">{tx.type}</div>
                    {tx.orderId && (
                      <div className="text-xs text-gray-500">Order: {String(tx.orderId)}</div>
                    )}
                  </div>
                  <div className={`font-semibold ${tx.type === 'help' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type === 'help' ? '-' : '+'}?{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperPointsPage;
