import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Layout from './layout/Layout';
import StaffManage from './pages/staff/StaffManage';
import ClaimEntry from './pages/Claim Entry/ClaimEntry';
import ClaimManage from './pages/ClaimManage/ClaimManage';
import ClaimReport from './pages/Claim Report/ClaimReport';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/" element={<Login />} />

        {/* Layout with nested routes */}
        <Route path="layout/:username" element={<Layout />}>
          {/* Nested routes under Layout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="staffmanage" element={<StaffManage />}/>
          <Route path="claimentry" element={<ClaimEntry />}/>
          <Route path="claimmanage" element={<ClaimManage />}/>
          <Route path="claimreport" element={<ClaimReport />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
