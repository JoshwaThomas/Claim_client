import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import useDelete from '../../hooks/useDelete';
import Button from '../../components/Button';

const AddUser = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Custom Hooks
  const { data: users = [], refetch } = useFetch(`${apiUrl}/api/getUser`);
  const { postData, loading: postLoading, error: postError } = usePost();
  const { deleteData, loading: deleteLoading, error: deleteError } = useDelete();

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await postData(`${apiUrl}/api/addUser`, formData);
    if (res) {
      setFormData({ username: '', password: '' });
      setOpenModal(false);
      if (typeof refetch === 'function') refetch();
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    const res = await deleteData(`${apiUrl}/api/deleteUser/${id}`);
    if (res && typeof refetch === 'function') {
      refetch();
    }
  };

  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Add Button */}
      <div className="w-full flex justify-end mb-4">
        <Button children="Add" onClick={() => setOpenModal(true)} />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">User List</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">S.NO</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Password</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr key={user._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-600">{index + 1}</td>
                <td className="px-6 py-3 text-gray-800 font-medium">{user.username}</td>
                <td className="px-6 py-3 text-gray-700">{user.password}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center px-6 py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-center">Add User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {postError && <p className="text-red-500 text-sm">{postError}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {postLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
