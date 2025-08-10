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

    await postData(endpoint, form);
    refetch();
    setShowModal(false);
    setEditingId(null);
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
  };

  return (
    <div className='p-6'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Claim Types</h2>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
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
            setEditingId(null); // ✅ Clear edit mode
            setShowModal(true);
          }}
        >
          Add Claim
        </Button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Something went wrong!</p>}

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead className="bg-blue-950 text-left text-xs uppercase font-semibold text-white">
            <tr>
              <th className="px-6 py-3">S.NO</th>
              <th className="px-6 py-3">Claim Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Amount Settings</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((claim, index) => (
                <tr key={claim._id} className="odd:bg-white even:bg-gray-100 hover:bg-gray-100">
                  <td className="px-6 py-4 font-semibold">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold">{claim.claim_type_name}</td>
                  <td className="px-6 py-4 font-semibold">{claim.description}</td>
                  <td className="px-6 py-4 text-xs">
                    {claim.amount_settings
                      ? Object.entries(claim.amount_settings).map(([key, val]) => (
                        <div key={key}>
                          <span className="font-semibold">{key.replace(/_/g, ' ')}:</span> ₹{val}
                        </div>
                      ))
                      : <span className="text-gray-400">No settings</span>}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(claim)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(claim._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No claim data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Claim Type' : 'Add Claim Type'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Claim Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Claim Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Amount Settings */}
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

              {/* Buttons */}
              <div className="flex justify-end gap-3">
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
