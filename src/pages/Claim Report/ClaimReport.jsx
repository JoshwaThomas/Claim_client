import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';

const ClaimReport = () => {
  const [filter, setFilter] = useState('all');
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: claimData, loading, error } = useFetch(`${apiUrl}/api/getclaimEntry`);

  // Extended filter logic
  const filteredClaims = claimData?.filter((claim) => {
    switch (filter) {
      case 'submitted':
        return claim.submission_date;
      case 'unsubmitted':
        return !claim.submission_date;
      case 'credited':
        return claim.credited_date;
      default:
        return true; // 'all'
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Claim Entry Report</h2>

      {/* Radio Filter */}
      <div className="mb-6 flex justify-center gap-6 flex-wrap">
        {['all', 'submitted', 'unsubmitted', 'credited'].map((type) => (
          <label key={type} className="flex items-center gap-2 text-gray-700">
            <input
              type="radio"
              name="filter"
              value={type}
              checked={filter === type}
              onChange={(e) => setFilter(e.target.value)}
            />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </label>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-blue-600 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-600 text-center">Failed to fetch data</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-950 border-b-2 border-gray-300">
              <tr>
                <th className="text-left p-3 font-semibold text-sm text-white">#</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Claim Type</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Staff Name</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Amount</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Entry Date</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Submission Date</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Credited Date</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Status</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Payement Id</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims?.map((claim, index) => (
                <tr
                  key={claim._id}
                  className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-100'}
                >
                  <td className="p-3 text-sm font-semibold text-gray-700">{index + 1}</td>
                  <td className="p-3 text-sm font-semibold text-gray-800">{claim.claim_type_name}</td>
                  <td className="p-3 text-sm font-semibold text-gray-800">{claim.staff_name}</td>
                  <td className="p-3 text-sm font-semibold text-green-700">₹{claim.amount}</td>
                  <td className="p-3 text-sm font-semibold text-gray-600">
                    {new Date(claim.entry_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="p-3 text-sm font-semibold text-gray-600">
                    {claim.submission_date ? new Date(claim.submission_date).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="p-3 text-sm font-semibold text-gray-600">
                    {claim.credited_date ? new Date(claim.credited_date).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="p-3 text-sm font-semibold text-gray-800">{claim.status}</td>
                  <td className="p-3 text-sm font-semibold text-gray-800">{claim.payment_report_id}</td>


                </tr>

              ))}
              {filteredClaims?.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No claim entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filter === 'unsubmitted' && filteredClaims?.length > 0 && (
            <div className="mb-4 text-center">
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                onClick={async () => {
                  try {
                    const res = await fetch(`${apiUrl}/api/submitClaims`, { method: 'PUT' });
                    const result = await res.json();
                    alert(result.message);
                    window.location.reload(); // or refetch via useFetch if you want smoother UX
                  } catch (err) {
                    alert('Failed to submit claims');
                  }
                }}
              >
                Submit All Unsubmitted Claims
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ClaimReport;
