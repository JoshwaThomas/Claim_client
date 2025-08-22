import React from 'react';

const PracticalFields = ({ form, setForm }) => {
  return (
    <>
      {/* QPS Paper Setting */}
      <div>
        <label className="text-sm font-semibold text-gray-700">QPS Paper Setting</label>
        <input
          type="text"
          value={form.qps_paper_setting || ""}
          onChange={(e) => setForm({ ...form, qps_paper_setting: e.target.value })}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter QPS paper setting details"
        />
      </div>

      {/* Degree Level (UG / PG) */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Degree Level
        </label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="UG"
              checked={form.degree_level === "UG"}
              onChange={(e) => setForm({ ...form, degree_level: e.target.value })}
            />
            UG
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="PG"
              checked={form.degree_level === "PG"}
              onChange={(e) => setForm({ ...form, degree_level: e.target.value })}
            />
            PG
          </label>
        </div>
      </div>


      {/* Total No. of Students */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Total No. of Students</label>
        <input
          type="number"
          value={form.total_students || ""}
          onChange={(e) => setForm({ ...form, total_students: e.target.value })}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter total number of students"
        />
      </div>

      {/* No. of Days Halted */}
      <div>
        <label className="text-sm font-semibold text-gray-700">No. of Days Halted</label>
        <input
          type="number"
          value={form.days_halted || ""}
          onChange={(e) => setForm({ ...form, days_halted: e.target.value })}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter number of days halted"
        />
      </div>

      {/* Travelling Allowance */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Travelling Allowance</label>
        <input
          type="number"
          value={form.travelling_allowance || ""}
          onChange={(e) => setForm({ ...form, travelling_allowance: e.target.value })}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter travelling allowance"
        />
      </div>
      {/* Tax Type Dropdown */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Tax Type
        </label>
        <select
          value={form.tax_type || ""}
          onChange={(e) => setForm({ ...form, tax_type: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Tax Type</option>
          <option value="Aided">Aided</option>
          <option value="SF">SF</option>
          <option value="AICTE">AICTE</option>
        </select>
      </div>

    </>
  );
};

export default PracticalFields;
