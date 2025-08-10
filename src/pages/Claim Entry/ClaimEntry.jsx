import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useFetch from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import QpsFields from './QpsFields';
import CiaReapear from './CiaReapear';
import ScrutinyField from './ScrutinyField';

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
    phone_number: '',
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
    account_no: '',
    qps_level: '',       // ✅ Add this for UG/PG
    no_of_qps: '',        // ✅ Add this for no. of QPS

    // ✅ For SCRUTINY CLAIM
    scrutiny_level: '',           // UG or PG
    scrutiny_no_of_papers: '',
    scrutiny_days: ''
  });


  useEffect(() => {
    const fetchAmount = async () => {
      const {
        claim_type_name,
        qps_level,
        no_of_qps,
        no_of_papers,
        scrutiny_level,
        scrutiny_no_of_papers,
        scrutiny_days
      } = form;

      // QPS logic
      if (
        claim_type_name === "QPS" &&
        qps_level &&
        no_of_qps &&
        !isNaN(no_of_qps)
      ) {
        try {
          const response = await axios.post(`${apiUrl}/api/calculateAmount`, {
            claim_type_name,
            qps_level,
            no_of_qps: parseInt(no_of_qps),
          });

          const { amount } = response.data;
          if (amount !== undefined) {
            setForm((prev) => ({ ...prev, amount: amount.toString() }));
          }
        } catch (error) {
          console.error("Error calculating QPS amount:", error.message);
        }
      }

      // CIA Reappear logic
      if (
        claim_type_name === "CIA REAPEAR CLAIM" &&
        no_of_papers &&
        !isNaN(no_of_papers)
      ) {
        try {
          const response = await axios.post(`${apiUrl}/api/calculateAmount`, {
            claim_type_name,
            no_of_papers: parseInt(no_of_papers),
          });

          const { amount } = response.data;
          if (amount !== undefined) {
            setForm((prev) => ({ ...prev, amount: amount.toString() }));
          }
        } catch (error) {
          console.error("Error calculating CIA amount:", error.message);
        }
      }

      // Scrutiny logic
      if (
        claim_type_name === "SCRUTINY CLAIM" &&
        scrutiny_level &&
        scrutiny_no_of_papers &&
        scrutiny_days &&
        !isNaN(scrutiny_no_of_papers) &&
        !isNaN(scrutiny_days)
      ) {
        try {
          const response = await axios.post(`${apiUrl}/api/calculateAmount`, {
            claim_type_name,
            scrutiny_level,
            scrutiny_no_of_papers: parseInt(scrutiny_no_of_papers),
            scrutiny_days: parseInt(scrutiny_days),
          });

          const { amount } = response.data;
          if (amount !== undefined) {
            setForm((prev) => ({ ...prev, amount: amount.toString() }));
          }
        } catch (error) {
          console.error("Error calculating Scrutiny amount:", error.message);
        }
      }
    };

    fetchAmount();
  }, [
    form.claim_type_name,
    form.qps_level,
    form.no_of_qps,
    form.no_of_papers,
    form.scrutiny_level,
    form.scrutiny_no_of_papers,
    form.scrutiny_days
  ]);






  //today date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, entry_date: today }));
  }, []);


  //fetch Staff by using phone Number
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

  //Submit the Claim data
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


        {form.claim_type_name === "QPS" && (
          <QpsFields form={form} setForm={setForm} />
        )}

        {form.claim_type_name === "CIA REAPEAR CLAIM" && (
          <CiaReapear form={form} setForm={setForm} />
        )}

        {form.claim_type_name === "SCRUTINY CLAIM" && (
          <ScrutinyField form={form} setForm={setForm} />
        )}

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold text-gray-700">Amount</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg ${form.claim_type_name === "QPS" ? 'bg-gray-100' : ''}`}
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
