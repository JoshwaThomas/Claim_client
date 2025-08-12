import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const StaffManage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [staffList, setStaffList] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [filters, setFilters] = useState({ department: '', designation: '', employment_type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    staff_id: '', staff_name: '', department: '', category: '', designation: '',
    phone_no: '', email: '', bank_acc_no: '',
    ifsc_code: '', employment_type: '', bank_name: '', branch_name: '', branch_code: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/staff`);
      setAllStaff(res.data);
      setStaffList(res.data);
    } catch {
      alert("Error fetching staff data.");
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  useEffect(() => {
    let filtered = allStaff.filter(item =>
      (item.staff_name || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone_no || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filters.department) filtered = filtered.filter(s => s.department === filters.department);
    if (filters.designation) filtered = filtered.filter(s => s.designation === filters.designation);
    if (filters.employment_type) filtered = filtered.filter(s => s.employment_type === filters.employment_type);

    setStaffList(filtered);
    setCurrentPage(1);
  }, [searchQuery, filters, allStaff]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      const res = await axios.post(`${apiUrl}/api/staff/upload`, formData);
      alert(res.data.message);
      fetchStaff();
      setExcelFile(null);
      document.querySelector('input[type=file]').value = '';
    } catch {
      alert("Upload failed.");
    }
  };

  const handleDelete = async (staff_id) => {
    if (!window.confirm('Are you sure to delete this record?')) return;
    try {
      await axios.delete(`${apiUrl}/api/staff/delete/${staff_id}`);
      fetchStaff();
    } catch {
      alert("Delete failed.");
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await axios.put(`${apiUrl}/api/staff/edit/${editingStaff.staff_id}`, formData);
        alert("Updated successfully.");
      } else {
        await axios.post(`${apiUrl}/api/staff`, formData);
        alert("Added successfully.");
      }
      setShowModal(false);
      setFormData({});
      setEditingStaff(null);
      fetchStaff();
    } catch {
      alert("Submit failed.");
    }
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData(staff);
    setShowModal(true);
  };

  const getUniqueValues = (key) => {
    const values = staffList.map(item => item[key]).filter(Boolean);
    return [...new Set(values)];
  };

  const paginatedStaff = staffList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(staffList.length / itemsPerPage);

  return (
    <div className="max-w-full mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-6 text-green-800">Staff Management Portal</h1>
      {/* Search & Upload */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 justify-between items-center">
        <input
          type="text"
          placeholder="Search by name, email or phone"
          className="p-2 border rounded w-full sm:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className='border w-[400px]'>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={e => setExcelFile(e.target.files[0])}
            className="file:bg-green-200 file:text-green-800 file:px-4 file:py-2 file:rounded-lg text-sm text-gray-600"
          />
          <button onClick={handleFileUpload} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition">
            Upload Excel
          </button>
        </div>
        <button onClick={() => { setFormData({}); setEditingStaff(null); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition">
          Add Staff
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {['department', 'designation', 'employment_type'].map(field => (
          <select key={field}
            className="p-2 border rounded"
            value={filters[field]}
            onChange={e => setFilters({ ...filters, [field]: e.target.value })}>
            <option value="">All {field.replace('_', ' ')}</option>
            {getUniqueValues(field).map((val, i) => (
              <option key={i} value={val}>{val}</option>
            ))}
          </select>
        ))}
      </div>

      <div className='flex justify-end'>
        <button
          className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          onClick={() => {
            const worksheet = XLSX.utils.json_to_sheet(staffList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Staff List");
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(data, "staff_list.xlsx");
          }}
        >
          Download Excel
        </button>
      </div>

      {/* Staff Table */}
      <div className="overflow-auto bg-white rounded-lg shadow mt-3">
        <table className="w-full text-sm text-center">
          <thead className="bg-purple-900 h-16 text-white">
            <tr>
              {['Staff Id', 'Name', 'Dept', 'Designation', 'Category', 'Phone', 'Email', 'Bank Acc', 'IFSC', 'Emp Type', 'Action'].map((h, i) => (
                <th key={i} className="px-2 py-2 border font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.map((s, i) => (
              <tr key={i} className="hover:bg-purple-50 font-bold">
                <td className="border px-2 py-2">{s.staff_id}</td>
                <td className="border px-2 py-2">{s.staff_name}</td>
                <td className="border px-2 py-2">{s.department}</td>
                <td className="border px-2 py-2">{s.designation}</td>
                <td className="border px-2 py-2">{s.category}</td>
                <td className="border px-2 py-2">{s.phone_no}</td>
                <td className="border px-2 py-2">{s.email}</td>
                <td className="border px-2 py-2">{s.bank_acc_no}</td>
                <td className="border px-2 py-2">{s.ifsc_code}</td>
                <td className="border px-2 py-2">{s.employment_type}</td>
                {/* <td className="border px-2 py-2">{s.bank_name}</td> */}
                <td className="border-b px-2 py-3 flex justify-center items-center gap-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.staff_id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginatedStaff.length === 0 && (
              <tr><td colSpan="11" className="py-4 text-gray-500">No data found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Page Size */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <label className="mr-2 text-sm font-medium">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="border rounded p-1 text-sm"
          >
            {[25, 50, 75, 100].map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg border">
            <h2 className="text-2xl mb-6 font-bold border-b pb-2">
              {editingStaff ? "Edit Staff" : "Add Staff"}
            </h2>
            <form onSubmit={handleSubmitForm} className="grid grid-cols-2 gap-4">
              {[
                'staff_id', 'staff_name', 'department', 'designation', 'category',
                'phone_no', 'email', 'bank_acc_no', 'ifsc_code',
                'employment_type', 'bank_name', 'branch_name', 'branch_code'
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="mb-1 font-medium capitalize">
                    {field.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="text"
                    placeholder={field.replace(/_/g, ' ')}
                    required
                    value={formData[field] || ''}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    className="border p-2 rounded"
                  />
                </div>
              ))}
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManage;
























// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const StaffManage = () => {
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const [staffList, setStaffList] = useState([]);
//   const [allStaff, setAllStaff] = useState([]);
//   const [excelFile, setExcelFile] = useState(null);
//   const [filters, setFilters] = useState({});
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingStaff, setEditingStaff] = useState(null);
//   const [formData, setFormData] = useState({
//     staff_id: '', staff_name: '', department: '', designation: '',
//     phone_no: '', email: '', bank_acc_no: '',
//     ifsc_code: '', employment_type: '', bank_name: '', branch_name: '', branch_code: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 100;

//   const fetchStaff = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/api/staff`);
//       setAllStaff(res.data);
//       setStaffList(res.data);
//     } catch {
//       alert("Error fetching staff data.");
//     }
//   };

//   useEffect(() => { fetchStaff(); }, []);

//   useEffect(() => {
//     let filtered = allStaff.filter(item =>
//       (item.staff_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (item.phone_no || '').toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         filtered = filtered.filter((item) => item[key] === value);
//       }
//     });

//     setStaffList(filtered);
//     setCurrentPage(1);
//   }, [searchQuery, filters, allStaff]);

//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     if (!excelFile) return alert("Please select a file");

//     const formData = new FormData();
//     formData.append('file', excelFile);

//     try {
//       const res = await axios.post(`${apiUrl}/api/staff/upload`, formData);
//       alert(res.data.message);
//       fetchStaff();
//       setExcelFile(null);
//       document.querySelector('input[type=file]').value = '';
//     } catch {
//       alert("Upload failed.");
//     }
//   };

//   const handleDelete = async (staff_id) => {
//     if (!window.confirm('Are you sure to delete this record?')) return;
//     try {
//       await axios.delete(`${apiUrl}/api/staff/delete/${staff_id}`);
//       fetchStaff();
//     } catch {
//       alert("Delete failed.");
//     }
//   };

//   const handleSubmitForm = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingStaff) {
//         await axios.put(`${apiUrl}/api/staff/edit/${editingStaff.staff_id}`, formData);
//         alert("Updated successfully.");
//       } else {
//         await axios.post(`${apiUrl}/api/staff`, formData);
//         alert("Added successfully.");
//       }
//       setShowModal(false);
//       setFormData({});
//       setEditingStaff(null);
//       fetchStaff();
//     } catch {
//       alert("Submit failed.");
//     }
//   };

//   const openEditModal = (staff) => {
//     setEditingStaff(staff);
//     setFormData(staff);
//     setShowModal(true);
//   };

//   const getUniqueValues = (key) => {
//     const values = allStaff.map(item => item[key]).filter(Boolean);
//     return [...new Set(values)];
//   };

//   const paginatedStaff = staffList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
//   const totalPages = Math.ceil(staffList.length / itemsPerPage);

//   const filterFields = [
//     "department", "designation", "phone_no", "email", "bank_acc_no",
//     "ifsc_code", "employment_type", "bank_name", "branch_name", "branch_code"
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4">
//       <h1 className="text-3xl font-bold text-center my-6 text-green-800">Staff Management Portal</h1>

//       {/* Search & Upload */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
//         <input
//           type="text"
//           placeholder="Search by name, email or phone"
//           className="p-2 border rounded w-full sm:w-1/2"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <input
//           type="file"
//           accept=".xlsx,.xls"
//           onChange={e => setExcelFile(e.target.files[0])}
//           className="file:bg-green-100 file:text-green-800 file:px-4 file:py-2 file:rounded-lg text-sm text-gray-600"
//         />
//         <button onClick={handleFileUpload} className="bg-green-600 text-white font-bold px-4 py-2 rounded">
//           Upload Excel
//         </button>
//         <button onClick={() => { setFormData({}); setEditingStaff(null); setShowModal(true); }}
//           className="bg-blue-600 text-white font-bold px-4 py-2 rounded">
//           Add Staff
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
//         {filterFields.map(field => (
//           <select
//             key={field}
//             className="p-2 border rounded"
//             value={filters[field] || ''}
//             onChange={e => setFilters({ ...filters, [field]: e.target.value })}
//           >
//             <option value="">All {field.replace(/_/g, ' ')}</option>
//             {getUniqueValues(field).map((val, i) => (
//               <option key={i} value={val}>{val}</option>
//             ))}
//           </select>
//         ))}
//       </div>

//       {/* Staff Table */}
//       <div className="overflow-auto bg-white rounded-xl shadow">
//         <table className="w-full border text-sm text-center">
//           <thead className="bg-purple-900 text-white">
//             <tr>
//               {['Staff Id', 'Name', 'Dept', 'Designation', 'Phone', 'Email', 'Bank Acc', 'IFSC', 'Emp Type', 'Bank Name', 'Action'].map((h, i) => (
//                 <th key={i} className="px-2 py-2 border">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedStaff.map((s, i) => (
//               <tr key={i} className="hover:bg-purple-50">
//                 <td className="border px-2 py-2">{s.staff_id}</td>
//                 <td className="border px-2 py-2">{s.staff_name}</td>
//                 <td className="border px-2 py-2">{s.department}</td>
//                 <td className="border px-2 py-2">{s.designation}</td>
//                 <td className="border px-2 py-2">{s.phone_no}</td>
//                 <td className="border px-2 py-2">{s.email}</td>
//                 <td className="border px-2 py-2">{s.bank_acc_no}</td>
//                 <td className="border px-2 py-2">{s.ifsc_code}</td>
//                 <td className="border px-2 py-2">{s.employment_type}</td>
//                 <td className="border px-2 py-2">{s.bank_name}</td>
//                 <td className="border px-2 py-2 space-x-2">
//                   <button onClick={() => openEditModal(s)} className="bg-green-600 text-white font-bold px-2 py-1 rounded">Edit</button>
//                   <button onClick={() => handleDelete(s.staff_id)} className="bg-red-500 text-white font-bold px-2 py-1 rounded">Delete</button>
//                 </td>
//               </tr>
//             ))}
//             {paginatedStaff.length === 0 && (
//               <tr><td colSpan="11" className="py-4 text-gray-500">No data found.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4 space-x-2">
//           {[...Array(totalPages)].map((_, i) => (
//             <button key={i} onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Add/Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-white bg-opacity-95 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg border">
//             <h2 className="text-xl mb-4 font-bold">{editingStaff ? "Edit Staff" : "Add Staff"}</h2>
//             <form onSubmit={handleSubmitForm} className="grid grid-cols-1 gap-3">
//               {[
//                 'staff_id', 'staff_name', 'department', 'designation', 'phone_no',
//                 'email', 'bank_acc_no', 'ifsc_code', 'employment_type',
//                 'bank_name', 'branch_name', 'branch_code'
//               ].map((field) => (
//                 <input
//                   key={field}
//                   type="text"
//                   placeholder={field.replace(/_/g, ' ')}
//                   required
//                   value={formData[field] || ''}
//                   onChange={e => setFormData({ ...formData, [field]: e.target.value })}
//                   className="border p-2 rounded"
//                 />
//               ))}
//               <div className="flex justify-end gap-2">
//                 <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
//                 <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffManage;
