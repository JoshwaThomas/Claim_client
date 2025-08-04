import React, { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';

const ClaimEntry = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: claimTypes } = useFetch(`${apiUrl}/api/getClaim`);
  const { postData } = usePost();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [form, setForm] = useState({
    claim_type_name: '',
    staff_id: '',
    staff_name: '',
    department: '',
    designation: '',
    internal_external: '',
    phone_number: '', // ✅ ADD THIS
    email: '',
    entry_date: '',
    submission_date: '',
    credited_date: '',
    amount: '',
    remarks: '',
    bank_name: '',
    branch_name: '',
    branch_code: '',
    ifsc_code: '',
    account_no: ''
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, entry_date: today }));
  }, []);

  const handleFetchStaff = async () => {
    if (!phoneNumber) return alert("Enter a phone number");

    try {
      const res = await fetch(`${apiUrl}/api/getStaffByPhone/${phoneNumber}`);
      const data = await res.json();

      if (res.ok) {
        setForm(prev => ({
          ...prev,
          staff_id: data.staff_id,
          staff_name: data.staff_name,
          department: data.department,
          designation: data.designation,
          internal_external: data.employment_type,
          phone_number: phoneNumber, // ✅ SET phone_number HERE
          email: data.email,
          bank_name: data.bank_name || '',
          branch_name: data.branch_name || '',
          branch_code: data.branch_code || '',
          ifsc_code: data.ifsc_code || '',
          account_no: data.bank_acc_no || ''
        }));
      } else {
        alert(data.message || "No staff found");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch staff");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postData(`${apiUrl}/api/postClaim`, form);
      alert("Claim submitted successfully");

      setForm({
        claim_type_name: form.claim_type_name,
        staff_id: '',
        staff_name: '',
        department: '',
        designation: '',
        internal_external: '',
        phone_number: '', // ✅ RESET IT HERE
        email: '',
        entry_date: new Date().toISOString().split('T')[0],
        submission_date: '',
        credited_date: '',
        amount: '',
        remarks: '',
        bank_name: '',
        branch_name: '',
        branch_code: '',
        ifsc_code: '',
        account_no: ''
      });

      setPhoneNumber('');
    } catch (err) {
      alert("Failed to submit claim");
    }
  };

  return (
    <div className="p-8 max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Claim Entry</h2>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2 bg-white p-8 rounded-xl shadow-lg border border-gray-200">

        {/* Claim Type */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Claim Type</label>
          <select
            value={form.claim_type_name}
            onChange={(e) => setForm({ ...form, claim_type_name: e.target.value })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Type</option>
            {claimTypes?.map((c) => (
              <option key={c._id} value={c.claim_type_name}>{c.claim_type_name}</option>
            ))}
          </select>
        </div>

        {/* Phone Number & Fetch */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Phone Number</label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter Phone Number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={handleFetchStaff}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Get
            </button>
          </div>
        </div>

        {/* Staff Info (Read Only) */}
        {[
          { label: "Staff ID", key: "staff_id" },
          { label: "Staff Name", key: "staff_name" },
          { label: "Department", key: "department" },
          { label: "Designation", key: "designation" },
          { label: "Internal / External", key: "internal_external" },
          { label: "Email", key: "email" },
          { label: "Bank Name", key: "bank_name" },
          { label: "Branch Name", key: "branch_name" },
          { label: "Branch Code", key: "branch_code" },
          { label: "IFSC Code", key: "ifsc_code" },
          { label: "Account Number", key: "account_no" }
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <input
              type="text"
              value={form[key]}
              readOnly
              className="mt-2 w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg"
            />
          </div>
        ))}

        {/* Entry Date */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Entry Date</label>
          <input
            type="date"
            value={form.entry_date}
            readOnly
            className="mt-2 w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg"
          />
        </div>

        {/* Submission Date */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Submission Date</label>
          <input
            type="date"
            value={form.submission_date}
            onChange={(e) => setForm({ ...form, submission_date: e.target.value })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Credited Date */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Credited Date</label>
          <input
            type="date"
            value={form.credited_date}
            onChange={(e) => setForm({ ...form, credited_date: e.target.value })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Amount</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Remarks */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">Remarks</label>
          <textarea
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            rows="3"
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimEntry;
