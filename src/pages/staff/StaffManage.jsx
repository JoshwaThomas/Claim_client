import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffManage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [staffList, setStaffList] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    designation: '',
    employment_type: '',
  });

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/staff`);
      setStaffList(res.data);
      setAllStaff(res.data);
    } catch (err) {
      alert("Error fetching staff data.");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    let filtered = allStaff;
    if (filters.department) filtered = filtered.filter(s => s.department === filters.department);
    if (filters.designation) filtered = filtered.filter(s => s.designation === filters.designation);
    if (filters.employment_type) filtered = filtered.filter(s => s.employment_type === filters.employment_type);
    setStaffList(filtered);
  }, [filters, allStaff]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) return alert("Please select a file first");

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      const res = await axios.post(`${apiUrl}/api/staff/upload`, formData);
      alert(res.data.message);
      setExcelFile(null);
      document.querySelector('input[type=file]').value = '';
      fetchStaff();
    } catch (err) {
      if (err.response?.data?.error) {
        alert(`❌ Upload failed: ${err.response.data.error}`);
      } else {
        alert("❌ Upload failed. Try again.");
      }
    }
  };

  const getUniqueValues = (key) => [...new Set(allStaff.map(item => item[key]))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-800">Staff Management Portal</h1>

        {/* Upload Form */}
        <form onSubmit={handleFileUpload} className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-md">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={e => setExcelFile(e.target.files[0])}
            className="block w-full sm:w-auto text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-100 file:text-green-800
                       hover:file:bg-green-200"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Upload Excel
          </button>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {['department', 'designation', 'employment_type'].map((field) => (
            <select
              key={field}
              value={filters[field]}
              onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
              className="p-3 rounded-xl border border-gray-300 bg-white shadow-sm"
            >
              <option value="">All {field.replace('_', ' ')}</option>
              {getUniqueValues(field).map((val, idx) => (
                <option key={idx} value={val}>{val}</option>
              ))}
            </select>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-xl shadow-md bg-white">
          <table className="min-w-full text-lg text-center border-collapse">
            <thead className="bg-purple-950 text-white">
              <tr>
                {['Staff Id', 'Name', 'Dept', 'Designation', 'Phone', 'Email', 'Bank Acc', 'IFSC', 'Emp Type','Action'].map((head, i) => (
                  <th key={i} className="px-4 py-3 border">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr key={index} className="hover:bg-purple-50 transition">
                  <td className="border px-4 py-2">{staff.staff_id}</td>
                  <td className="border px-4 py-2">{staff.staff_name}</td>
                  <td className="border px-4 py-2">{staff.department}</td>
                  <td className="border px-4 py-2">{staff.designation}</td>
                  <td className="border px-4 py-2">{staff.phone_no}</td>
                  <td className="border px-4 py-2">{staff.email}</td>
                  <td className="border px-4 py-2">{staff.bank_acc_no}</td>
                  <td className="border px-4 py-2">{staff.ifsc_code}</td>
                  <td className="border px-4 py-2">{staff.employment_type}</td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-400">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManage;
