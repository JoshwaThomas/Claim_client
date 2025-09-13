import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ClaimReport = () => {
  const [filter, setFilter] = useState('all');
  const [claimType, setClaimType] = useState('all');
  const [entryDate, setEntryDate] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: claimData, loading, error, refetch } = useFetch(`${apiUrl}/api/getclaimEntry`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const claimTypes = [...new Set(claimData?.map((claim) => claim.claim_type_name))];

  // Apply filters
  const filteredClaims = claimData?.filter((claim) => {
    switch (filter) {
      case 'submitted':
        if (!claim.submission_date) return false;
        break;
      case 'unsubmitted':
        if (claim.submission_date) return false;
        break;
      case 'credited':
        if (!claim.credited_date) return false;
        break;
      default:
        break;
    }
    if (claimType !== 'all' && claim.claim_type_name !== claimType) return false;
    if (entryDate && new Date(claim.entry_date).toLocaleDateString('en-CA') !== entryDate) return false;
    return true;
  });

  // Check if already submitted claims exist in current filtered set
  const submittedClaims = claimData?.filter((claim) =>
    claim.submission_date && 
    (claimType === 'all' || claim.claim_type_name === claimType) &&
    (entryDate ? new Date(claim.entry_date).toLocaleDateString('en-CA') === entryDate : true) &&
    (filter === 'submitted' || filter === 'all')
  );

  // Extract existing PR ID & submission date for submitted claims (assumes all have same PR ID)
  const existingPrId = submittedClaims && submittedClaims.length > 0 ? submittedClaims[0].payment_report_id : '';
  const existingSubmissionDate = submittedClaims && submittedClaims.length > 0 
    ? new Date(submittedClaims[0].submission_date).toLocaleDateString('en-GB') 
    : '';

  // Single button handler for submit and download
  const handleSubmitAndDownloadPDF = async () => {
    setIsSubmitting(true);
    try {
      // Only submit if there are unsubmitted claims
      if (filteredClaims.length === 0) {
        alert('No unsubmitted claims to submit.');
        setIsSubmitting(false);
        return;
      }

      // Call backend to submit unsubmitted claims
      const submitRes = await fetch(`${apiUrl}/api/submitClaims`, { method: 'PUT' });

      if (submitRes.ok) {
        const result = await submitRes.json();
        const prId = result.prId || existingPrId || `PR-${new Date().getFullYear()}-000`; // fallback
        const actualSubmittedDate = result.submission_date || new Date().toLocaleDateString('en-GB');

        // Refresh data to get updated claims
        if (refetch) await refetch();

        // After refresh, reconstruct filtered claims to pass updated data
        const updatedClaims = claimData?.filter((claim) => {
          switch (filter) {
            case 'submitted':
              if (!claim.submission_date) return false;
              break;
            case 'unsubmitted':
              if (claim.submission_date) return false;
              break;
            case 'credited':
              if (!claim.credited_date) return false;
              break;
            default:
              break;
          }
          if (claimType !== 'all' && claim.claim_type_name !== claimType) return false;
          if (entryDate && new Date(claim.entry_date).toLocaleDateString('en-CA') !== entryDate) return false;
          return true;
        }) || [];

        createPDF(prId, actualSubmittedDate, updatedClaims);
      } else {
        const result = await submitRes.json();
        alert(result.message || 'Failed to submit claims.');
      }
    } catch (err) {
      alert('Failed to submit claims.');
    }
    setIsSubmitting(false);
  };

  // Download PDF without submitting again (reuses existing PR ID)
  const handleDownloadExistingPDF = () => {
    if (!existingPrId) {
      alert('No submitted claims available to download PDF.');
      return;
    }

    const submittedFilteredClaims = claimData?.filter((claim) =>
      claim.payment_report_id === existingPrId
    ) || [];

    createPDF(existingPrId, existingSubmissionDate, submittedFilteredClaims);
  };

  // PDF generator
  const createPDF = (prId, submittedDate, claims) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Claims Report - ${prId}`, 14, 12);
    doc.setFontSize(14);

    const tableColumn = [
      "Sno",
      "Claim Type",
      "Staff Name",
      "Amount",
      "Entry Date",
      "Submission Date",
      "Credited Date",
      "Status",
      "Payment Id"
    ];
    const tableRows = claims?.map((claim, index) => [
      index + 1,
      claim.claim_type_name,
      claim.staff_name,
      claim.amount,
      claim.entry_date ? new Date(claim.entry_date).toLocaleDateString('en-GB') : "-",
      claim.submission_date ? new Date(claim.submission_date).toLocaleDateString('en-GB') : submittedDate,
      claim.credited_date ? new Date(claim.credited_date).toLocaleDateString('en-GB') : "-",
      claim.status,
      claim.payment_report_id || prId
    ]);

    autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 28,
    styles: { fontSize: 8 }, // Increase table font size here
    headStyles: { fontSize: 10 }, // Bigger font for header row
  });
    doc.save(`ClaimEntryReport_${prId}.pdf`);
  };


  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Claim Entry Report</h2>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap justify-center gap-6">
        <div className="flex gap-4">
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
        <select
          value={claimType}
          onChange={(e) => setClaimType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="all">All Claim Types</option>
          {claimTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Table */}
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
              <th className="text-left p-3 font-semibold text-sm text-white">Payment Id</th>
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
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No claim entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      {filter === 'unsubmitted' && filteredClaims?.length > 0 && (
        <div className="mt-5 text-center flex justify-end">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            onClick={handleSubmitAndDownloadPDF}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Submit & Download PDF"}
          </button>
        </div>
      )}

      {/* Show Download button if there are submitted claims */}
      {(filter === 'submitted' || filter === 'all') && existingPrId && (
        <div className="mt-5 text-center flex justify-end">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
            onClick={handleDownloadExistingPDF}
            disabled={isSubmitting}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimReport;
