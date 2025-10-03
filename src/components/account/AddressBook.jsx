import React, { useEffect, useState } from 'react';
import { MapPin, Trash2, Edit2, Plus, CheckCircle } from 'lucide-react';
import { addressesAPI } from '../../services/api';

const defaultAddress = {
  id: '',
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'India',
  isDefault: false,
};

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultAddress);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await addressesAPI.getAddresses();
        setAddresses(data.addresses || []);
      } catch (e) {
        console.error('Failed to load addresses', e);
      }
    };
    load();
  }, []);

  const refresh = async () => {
    try {
      const data = await addressesAPI.getAddresses();
      setAddresses(data.addresses || []);
    } catch (e) {
      console.error('Failed to refresh addresses', e);
    }
  };

  const resetForm = () => {
    setForm(defaultAddress);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setForm({ ...addr });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const remove = async (id) => {
    try {
      await addressesAPI.deleteAddress(id);
      await refresh();
    } catch (e) {
      console.error('Failed to delete address', e);
    }
  };

  const setDefault = async (id) => {
    try {
      await addressesAPI.updateAddress(id, { isDefault: true });
      await refresh();
    } catch (e) {
      console.error('Failed to set default address', e);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    // Basic validation
    if (!payload.fullName || !payload.phone || !payload.addressLine1 || !payload.city || !payload.state || !payload.zipCode) {
      setLoading(false);
      return;
    }
    try {
      if (editingId) {
        await addressesAPI.updateAddress(editingId, payload);
      } else {
        await addressesAPI.addAddress(payload);
      }
      await refresh();
      setShowForm(false);
      resetForm();
    } catch (e) {
      console.error('Failed to save address', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-white">
          <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <div className="text-gray-600">No addresses saved yet.</div>
          <button onClick={openAdd} className="btn btn-primary mt-4">Add Your First Address</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{addr.fullName}</div>
                  <div className="text-sm text-gray-600">{addr.phone}</div>
                  <div className="text-sm text-gray-700 mt-2">
                    <div>{addr.addressLine1}</div>
                    {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                    <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                    <div>{addr.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addr.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" /> Default
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)} className="text-blue-600 text-sm font-medium">Set as Default</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(addr)} className="p-2 text-gray-700 hover:text-blue-600">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(addr.id)} className="p-2 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingId ? 'Edit Address' : 'Add Address'}</h3>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input value={form.fullName} onChange={(e)=>setForm({...form, fullName: e.target.value})} className="input w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} className="input w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input value={form.addressLine1} onChange={(e)=>setForm({...form, addressLine1: e.target.value})} className="input w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (optional)</label>
                <input value={form.addressLine2} onChange={(e)=>setForm({...form, addressLine2: e.target.value})} className="input w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} className="input w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input value={form.state} onChange={(e)=>setForm({...form, state: e.target.value})} className="input w-full" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input value={form.zipCode} onChange={(e)=>setForm({...form, zipCode: e.target.value})} className="input w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input value={form.country} onChange={(e)=>setForm({...form, country: e.target.value})} className="input w-full" required />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>{ setShowForm(false); resetForm(); }} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary flex-1">{loading ? 'Saving...' : 'Save Address'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
