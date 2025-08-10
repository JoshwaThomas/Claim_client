// components/claimTypes/QpsFields.jsx
import React from 'react';

const QpsFields = ({ form, setForm }) => {
  return (
    <>
      {/* UG / PG Radio Buttons */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Select Level (UG / PG)
        </label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="UG"
              checked={form.qps_level === "UG"}
              onChange={(e) => setForm({ ...form, qps_level: e.target.value })}
            />
            UG
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="PG"
              checked={form.qps_level === "PG"}
              onChange={(e) => setForm({ ...form, qps_level: e.target.value })}
            />
            PG
          </label>
        </div>
      </div>

      {/* No. of QPS */}
      <div>
        <label className="text-sm font-semibold text-gray-700">No. of QPS</label>
        <input
          type="number"
          value={form.no_of_qps}
          onChange={(e) => setForm({ ...form, no_of_qps: e.target.value })}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter number of QPS"
        />
      </div>
    </>
  );
};

export default QpsFields;
