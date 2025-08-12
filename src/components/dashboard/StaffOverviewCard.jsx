import React from 'react';
import { FaUserTie, FaUsers } from 'react-icons/fa';

const StaffOverviewCard = ({ internalCount = 0, externalCount = 0 }) => {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl ring-1 ring-gray-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Staff Overview</h3>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Internal Staff */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full shadow-md">
            <FaUserTie className="text-2xl text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Internal Staff</p>
            <p className="text-xl font-semibold text-gray-800">{internalCount}</p>
          </div>
        </div>

        {/* External Staff */}
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full shadow-md">
            <FaUsers className="text-2xl text-green-700" />
          </div>
          <div>
            <p className="text-sm text-gray-500">External Staff</p>
            <p className="text-xl font-semibold text-gray-800">{externalCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOverviewCard;
