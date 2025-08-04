import React from 'react';
import useFetch from '../../hooks/useFetch';

const ClaimReport = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: claimData, loading, error } = useFetch(`${apiUrl}/api/getclaimEntry`);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Claim Entry Report</h2>

      {loading ? (
        <p className="text-blue-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Failed to fetch data</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-950 border-b-2 border-gray-300">
              <tr>
                <th className="text-left p-3 font-semibold text-sm text-white">#</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Claim Type</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Staff Name</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Department</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Amount</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Entry Date</th>
                <th className="text-left p-3 font-semibold text-sm text-white">IFSC</th>
                <th className="text-left p-3 font-semibold text-sm text-white">Account No</th>
              </tr>
            </thead>
            <tbody>
              {claimData?.map((claim, index) => (
                <tr
                  key={claim._id}
                  className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-100'}
                >
                  <td className="p-3 text-sm font-semibold   text-gray-700">{index + 1}</td>
                  <td className="p-3 text-sm font-semibold text-gray-800">{claim.claim_type_name}</td>
                  <td className="p-3 text-sm font-semibold text-gray-800">{claim.staff_name}</td>
                  <td className="p-3 text-sm font-semibold text-gray-700">{claim.department}</td>
                  <td className="p-3 text-sm font-semibold text-green-700">₹{claim.amount}</td>
                  <td className="p-3 text-sm font-semibold text-gray-600">{new Date(claim.entry_date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm font-semibold text-gray-600">{claim.ifsc_code}</td>
                  <td className="p-3 text-sm font-semibold text-gray-600">{claim.account_no}</td>
                </tr>
              ))}
              {claimData?.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No claim entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClaimReport;
