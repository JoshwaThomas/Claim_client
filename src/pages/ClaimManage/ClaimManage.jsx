import React, { useState } from 'react';
import Button from '../../components/Button';
import { Plus, Trash, Pencil } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import useDelete from '../../hooks/useDelete';

const ClaimManage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    amount_settings: {
      scrutiny_ug_rate: '',
      scrutiny_pg_rate: '',
      scrutiny_day_rate: '',
      qps_rate: '',
      cia_rate: ''
    }
  });

  const { data, loading, error, refetch } = useFetch(`${apiUrl}/api/getClaim`);
  const { postData } = usePost();
  const { deleteData } = useDelete();

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      amount_settings: {
        scrutiny_ug_rate: '',
        scrutiny_pg_rate: '',
        scrutiny_day_rate: '',
        qps_rate: '',
        cia_rate: ''
      }
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      amount_settings: {
        ...prev.amount_settings,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editingId
      ? `${apiUrl}/api/updateClaim/${editingId}`
      : `${apiUrl}/api/addclaim`;

    const payload = editingId ? form : {
      name: form.name,
      description: form.description
    };

    await postData(endpoint, payload);
    refetch();
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (claim) => {
    setForm({
      name: claim.claim_type_name,
      description: claim.description,
      amount_settings: claim.amount_settings || {
        scrutiny_ug_rate: '',
        scrutiny_pg_rate: '',
        scrutiny_day_rate: '',
        qps_rate: '',
        cia_rate: ''
      }
    });
    setEditingId(claim._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteData(`${apiUrl}/api/deleteClaim/${id}`);
    refetch();
    setConfirmDeleteId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-950">🎯 Claim Types</h2>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowModal(true);
          }}
        >
          Add Claim
        </Button>
      </div>

      {/* Status */}
      {loading && <p className="text-gray-500">Loading claims...</p>}
      {error && <p className="text-red-500">Something went wrong!</p>}

      {/* Claim Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.length > 0 ? (
          data.map((claim, index) => (
            <div key={claim._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-blue-900">{claim.claim_type_name}</h3>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{claim.description}</p>
              <div className="text-xs space-y-1">
                {claim.amount_settings
                  ? Object.entries(claim.amount_settings).map(([key, val]) => (
                    <div key={key}>
                      <span className="font-semibold text-gray-700">{key.replace(/_/g, ' ')}:</span> ₹{val}
                    </div>
                  ))
                  : <span className="text-gray-400">No settings</span>}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button icon={Pencil} size="sm" variant="outline" onClick={() => handleEdit(claim)}>Edit</Button>
                <Button icon={Trash} size="sm" variant="danger" onClick={() => setConfirmDeleteId(claim._id)}>Delete</Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No claim data found</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this claim?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Claim Type' : 'Add Claim Type'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Claim Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {editingId && form.amount_settings && Object.values(form.amount_settings).some(val => val !== '') && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Amount Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(form.amount_settings).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </label>
                        <input
                          type="number"
                          name={key}
                          value={value}
                          onChange={handleAmountChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="text-sm px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default ClaimManage;
