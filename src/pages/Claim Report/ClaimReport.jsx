import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ClaimReport = () => {
  const [filter, setFilter] = useState('all');
<<<<<<< HEAD
  const [claimTypeFilter, setClaimTypeFilter] = useState('');
  const [claimTypes, setClaimTypes] = useState([]);

=======
  const [claimType, setClaimType] = useState('all');
  const [entryDate, setEntryDate] = useState('');
>>>>>>> e554f52b5573892cedb0bcedce03e24f79a76dac
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: claimData, loading, error, refetch } = useFetch(`${apiUrl}/api/getclaimEntry`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const claimTypes = [...new Set(claimData?.map((claim) => claim.claim_type_name))];

  // Core filtered claims for table
  const filteredClaims = claimData?.filter((claim) => {
    const isUnsubmitted = !claim.submission_date;
    const matchesClaimType = claim.claim_type_name?.toLowerCase().includes(claimTypeFilter.toLowerCase());

    switch (filter) {
      case 'submitted':
        if (!claim.submission_date) return false;
        break;
      case 'unsubmitted':
<<<<<<< HEAD
        return isUnsubmitted && matchesClaimType;
=======
        if (claim.submission_date) return false;
        break;
>>>>>>> e554f52b5573892cedb0bcedce03e24f79a76dac
      case 'credited':
        if (!claim.credited_date) return false;
        break;
      default:
<<<<<<< HEAD
        return true;
=======
        break;
>>>>>>> e554f52b5573892cedb0bcedce03e24f79a76dac
    }
    if (claimType !== 'all' && claim.claim_type_name !== claimType) return false;
    if (entryDate && new Date(claim.entry_date).toLocaleDateString('en-CA') !== entryDate) return false;
    return true;
  }) || [];

  // Handler for download filtered claims when filter === 'all'
  const handleDownloadClaimTypePDF = () => {
    // Collect claims matching claimType dropdown and entryDate filter
    const selectedClaims = (claimData || []).filter((claim) =>
      (claimType === 'all' || claim.claim_type_name === claimType) &&
      (entryDate ? new Date(claim.entry_date).toLocaleDateString('en-CA') === entryDate : true)
    );
    if (selectedClaims.length === 0) {
      alert('No claims found to download.');
      return;
    }
    // Use PR ID/submission date from first result, fallback to something generic
    const prId = selectedClaims[0]?.payment_report_id || `PR-${new Date().getFullYear()}-000`;
    const submissionDate = selectedClaims[0]?.submission_date
      ? new Date(selectedClaims[0].submission_date).toLocaleDateString('en-GB')
      : new Date().toLocaleDateString('en-GB');
    createPDF(prId, submissionDate, selectedClaims);
  };

  // PDF creator (unchanged)
  const createPDF = (prId, submittedDate, claims) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Claims Report - ${prId}`, 14, 12);
    doc.setFontSize(14);
    const tableColumn = [
      "Sno", "Claim Type", "Staff Name", "Amount", "Entry Date", "Submission Date",
      "Credited Date", "Status", "Payment Id"
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
      styles: { fontSize: 8 },
      headStyles: { fontSize: 10 },
    });
    doc.save(`ClaimEntryReport_${prId}.pdf`);
  };

  const handleSubmitAndDownloadPDF = async () => {
    setIsSubmitting(true);
    try {
      if (filteredClaims.length === 0) {
        alert('No unsubmitted claims to submit.');
        setIsSubmitting(false);
        return;
      }

      // Send claimType as body param
      const submitRes = await fetch(`${apiUrl}/api/submitClaims`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimType })
      });

      if (submitRes.ok) {
        const result = await submitRes.json();
        const prId = result.prId || existingPrId || `PR-${new Date().getFullYear()}-000`;
        const getDateOnlyString = (dateStr) => {
          const d = new Date(dateStr);
          return d.toLocaleDateString('en-GB'); // DD/MM/YYYY format without time
        };

        const actualSubmittedDate = result.submission_date
          ? getDateOnlyString(result.submission_date)
          : getDateOnlyString(new Date());


        if (refetch) await refetch();

        // After refetch, use updated filtered claims JUST for selected claim type
        const updatedClaims = (claimData || []).filter((claim) => {
          if (claimType !== 'all' && claim.claim_type_name !== claimType) return false;
          if (filter === 'unsubmitted' && claim.submission_date) return false;
          if (entryDate && new Date(claim.entry_date).toLocaleDateString('en-CA') !== entryDate) return false;
          return true;
        });

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

  // Downloads PDF only for currently shown submitted claims (filtered by claimType)
  const handleDownloadExistingPDF = () => {
    if (!existingPrId) {
      alert('No submitted claims available to download PDF.');
      return;
    }
    const submittedFilteredClaims = (claimData || []).filter((claim) =>
      claim.payment_report_id === existingPrId &&
      (claimType === 'all' || claim.claim_type_name === claimType)
    );
    createPDF(existingPrId, existingSubmissionDate, submittedFilteredClaims);
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
      {/* Only show Download PDF button when radio 'All' is selected */}
      <div className='-mt-16'>
        {filter === 'all' && (
          <div className="text-center flex justify-end">
            <button
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
              onClick={handleDownloadClaimTypePDF}
              disabled={isSubmitting}
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
      {/* Table */}
      <h1 className='text-lg font-bold text-end mt-4'>No.of.Claims : {filteredClaims.length} </h1>
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 mt-5">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-950 border-b-2 border-gray-300">
            <tr>
              {["S.No", "Claim Type", "Staff Name", "Amount", "Entry Date", "Submission Date", "Credited Date", "Status", "Payment Id"]
                .map(h => (
                  <th key={h} className="text-left p-3 font-semibold text-sm text-white">{h}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim, index) => (
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
            {filteredClaims.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No claim entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

<<<<<<< HEAD
      {/* Claim Type Filter */}
      {filter === 'unsubmitted' && (
        <div className="mb-4 flex justify-center gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Filter by Claim Type"
            className="border px-4 py-2 rounded w-64"
            value={claimTypeFilter}
            onChange={(e) => setClaimTypeFilter(e.target.value)}
          />
        </div>
      )}

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
                <th className="text-left p-3 font-semibold text-sm text-white">Payment ID</th>
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
                  <td className="p-3 text-sm font-semibold">
                    {claim.status === 'Submitted to Principal' ? (
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded">Submitted</span>
                    ) : claim.status === 'Credited' ? (
                      <span className="text-green-700 bg-green-100 px-2 py-1 rounded">Credited</span>
                    ) : claim.status === 'Pending' ? (
                      <span className="text-red-700 bg-red-100 px-2 py-1 rounded">Pending</span>
                    ) : (
                      <span className="text-gray-700">{claim.status}</span>
                    )}
                  </td>


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

          {/* Submit & Download Button */}
          {filter === 'unsubmitted' && filteredClaims?.length > 0 && (
            <div className="mb-4 text-center">
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                onClick={async () => {
                  try {
                    const res = await fetch(`${apiUrl}/api/submitFilteredClaims`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ claimIds: filteredClaims.map((c) => c._id) })
                    });
                    const result = await res.json();

                    const pdfRes = await fetch(`${apiUrl}/api/downloadSubmittedClaims/${result.paymentReportId}`);
                    const blob = await pdfRes.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ClaimReport_${result.paymentReportId}.pdf`;
                    a.click();

                    alert(result.message);
                    window.location.reload();
                  } catch (err) {
                    alert('Failed to submit and download claims');
                  }
                }}
              >
                Submit & Download Filtered Claims
              </button>
            </div>
          )}
=======
      {/* Buttons */}
      {filter === 'unsubmitted' && filteredClaims.length > 0 && (
        <div className="mt-5 text-center flex justify-end">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
            onClick={handleSubmitAndDownloadPDF}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Submit & Download PDF"}
          </button>
>>>>>>> e554f52b5573892cedb0bcedce03e24f79a76dac
        </div>
      )}



    </div>
  );
};

export default ClaimReport;
