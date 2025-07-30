import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const ClaimCard = ({ title, count, amount, color = 'blue', showAlert = false }) => {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const colorClasses = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 relative hover:shadow-lg transition duration-200">
      {showAlert && (
        <div className="absolute top-2 right-2">
          <span className="flex items-center gap-1 text-red-600 font-semibold text-sm">
            <FaExclamationCircle className="text-red-500" />
            Alert
          </span>
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      <div className={`text-sm rounded-md px-3 py-2 font-medium inline-block ${colorClasses}`}>
        Count: {count}
      </div>
      <div className="text-gray-600 mt-2 font-semibold">
        Amount: ₹{amount.toLocaleString()}
      </div>
    </div>
  );
};

export default ClaimCard;
