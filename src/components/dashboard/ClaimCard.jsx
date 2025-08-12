// import React from 'react';
// import { FaExclamationCircle } from 'react-icons/fa';

// const ClaimCard = ({ title, count, amount, color = 'blue', showAlert = false }) => {
//   const colorMap = {
//     blue: 'bg-blue-100 text-blue-800',
//     green: 'bg-green-100 text-green-800',
//     red: 'bg-red-100 text-red-800',
//     yellow: 'bg-yellow-100 text-yellow-800',
//     gray: 'bg-gray-100 text-gray-800',
//   };

//   const colorClasses = colorMap[color] || colorMap.blue;

//   return (
//     <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200 relative hover:shadow-lg transition duration-200">
//       {showAlert && (
//         <div className="absolute top-2 right-2">
//           <span className="flex items-center gap-1 text-red-600 font-semibold text-sm">
//             <FaExclamationCircle className="text-red-500" />
//             Alert
//           </span>
//         </div>
//       )}
//       <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
//       <div className={`text-sm rounded-md px-3 py-2 font-medium inline-block ${colorClasses}`}>
//         Count: {count}
//       </div>
//       <div className="text-gray-600 mt-2 font-semibold">
//         Amount: ₹{amount.toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default ClaimCard;




import React from 'react';
import { FaExclamationCircle, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';

const ClaimCard = ({ title, count, amount, color = 'blue', showAlert = false }) => {
  const gradientMap = {
    blue: 'from-blue-100 to-blue-50 text-blue-800 border-blue-300',
    green: 'from-green-100 to-green-50 text-green-800 border-green-300',
    red: 'from-red-100 to-red-50 text-red-800 border-red-300',
    yellow: 'from-yellow-100 to-yellow-50 text-yellow-800 border-yellow-300',
    gray: 'from-gray-100 to-gray-50 text-gray-800 border-gray-300',
  };

  const gradientClasses = gradientMap[color] || gradientMap.blue;

  return (
    <div
      className={`bg-gradient-to-br ${gradientClasses} rounded-2xl p-6 border shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out relative backdrop-blur-sm`}
    >
      {/* Alert Badge */}
      {showAlert && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-red-600 text-sm font-semibold bg-white/80 px-2 py-1 rounded-full shadow-sm">
          <FaExclamationCircle className="text-red-500" />
          Alert
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{title}</h3>

      {/* Divider */}
      <div className="h-[1px] bg-gray-300/50 mb-4" />

      {/* Count Section */}
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-white/70 p-2 rounded-full shadow-sm">
          <FaClipboardList className="text-xl text-gray-600" />
        </div>
        <span className="text-lg font-medium text-gray-700">
          <strong className="text-gray-900">{count}</strong> claims
        </span>
      </div>

      {/* Amount Section */}
      <div className="flex items-center gap-3">
        <div className="bg-white/70 p-2 rounded-full shadow-sm">
          <FaMoneyBillWave className="text-xl text-gray-600" />
        </div>
        <span className="text-lg font-medium text-gray-700">
          ₹<strong className="text-gray-900">{amount.toLocaleString()}</strong>
        </span>
      </div>
    </div>
  );
};

export default ClaimCard;
