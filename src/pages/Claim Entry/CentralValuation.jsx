import React from 'react';

const CentralValuation = ({ form, setForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div>
        <label className="text-sm font-semibold text-gray-700">Chairman / Examiner</label>
        <select
          name="central_role"
          value={form.central_role}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Role</option>
          <option value="Chairman">Chairman</option>
          <option value="Examiner">Examiner</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">Total Scripts (UG/PG)</label>
        <input
          type="number"
          name="central_total_scripts_ug_pg"
          value={form.central_total_scripts_ug_pg}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter total scripts"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">No. of Days Halted</label>
        <input
          type="number"
          name="central_days_halted"
          value={form.central_days_halted}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter halt days"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">Travel Allowance</label>
        <input
          type="number"
          name="central_travel_allowance"
          value={form.central_travel_allowance}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter travel allowance"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700">Tax Type</label>
        <select
          name="central_tax_applicable"
          value={form.central_tax_applicable}
          onChange={handleChange}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Tax Type</option>
          <option value="AIDED">Aided</option>
          <option value="SF">Self-Financed</option>
        </select>
      </div>
    </>
  );
};

export default CentralValuation;
