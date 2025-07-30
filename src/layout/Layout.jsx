import React from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaClipboardList, FaFileInvoiceDollar, FaChartBar, FaUserCircle } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';


const Layout = () => {
  const location = useLocation();
  const { username } = useParams();

  const sidebarMenu = [
    {
      name: 'Dashboard',
      path: `/layout/${username}/dashboard`,
      icon: <FaTachometerAlt /> // Dashboard icon
    },
    {
      name: 'Staff Manage',
      path: `/layout/${username}/staffmanage`,
      icon: <FaUsers /> // People/Staff icon
    },
    {
      name: 'Claim Entry',
      path: `/layout/${username}/claimentry`,
      icon: <FaClipboardList /> // Form entry/checklist icon
    },
    {
      name: 'Claim Manage',
      path: `/layout/${username}/claimmanage`,
      icon: <FaFileInvoiceDollar /> // Invoice or finance icon
    },
    {
      name: 'Report',
      path: `/layout/${username}/claimreport`,
      icon: <FaChartBar /> // Chart/Report icon
    },
    {
      name: 'Logout',
      path: "/",
      icon: <IoIosLogOut /> // Logout icon
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-gray-700 p-5 border-r border-gray-200 shadow-sm">
        <h2 className="text-3xl font-extrabold mb-6 tracking-wide">
          <span className="text-blue-600">Claim</span>{' '}
          <span className="text-gray-800">Manager</span>
        </h2>
        <nav className="space-y-1">
          {sidebarMenu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition duration-200
          ${location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-blue-600'}
        `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>


      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* Show Logged-in Username */}
        <div className="mb-6 flex justify-end">
          <div className="bg-white border border-gray-300 shadow-sm px-4 py-2 rounded-lg text-sm text-gray-700 font-semibold flex items-center gap-2">
            <FaUserCircle className="text-blue-500 text-xl" />
            Logged in as: <span className="text-gray-900 font-bold">{username}</span>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
