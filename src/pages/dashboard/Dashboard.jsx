import React from 'react';
import ClaimCard from '../../components/dashboard/ClaimCard';
import ClaimSummaryTable from '../../components/dashboard/ClaimTable';
import ClaimPieChart from '../../components/dashboard/ClaimPieChart';
import useFetch from '../../hooks/useFetch';

const Dashboard = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  //hooks 
  const { data } = useFetch(`${apiUrl}/api/totalclaimscount`)
  return (
    <div className="space-y-8 p-4">
      {/* Claim Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ClaimCard
          title="Total Claims Received"
          count={data?.totalClaims || 0}
          amount={data?.totalAmount || 0}
          color="blue"
        />


        <ClaimCard
          title="Total Claims Sanctioned"
          count={85}
          amount={420000}
          color="green"
        />
        <ClaimCard
          title="Pending Claims"
          count={35}
          amount={130000}
          color="yellow"
        />
        <ClaimCard
          title="Claims Awaiting Sanction (>7 days)"
          count={10}
          amount={40000}
          color="red"
          showAlert={true}
        />
      </div>

      {/* Claim Summary Table (Full Width) */}
      <ClaimSummaryTable />
      <div>

      </div>
      {/* Pie Charts Section (One row with two charts) */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <ClaimPieChart
            title="Claims Breakdown"
            data={[
              { name: 'Internal Claims', value: 300 },
              { name: 'External Claims', value: 200 }
            ]}
          />
        </div>
        <div className="w-full md:w-1/2">
          <ClaimPieChart
            title="Staff Overview"
            data={[
              { name: 'Internal Staff', value: 300 },
              { name: 'External Staff', value: 200 }
            ]}
          />
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
