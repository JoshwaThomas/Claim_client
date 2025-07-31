import React from 'react'
import Button from '../../components/Button'
import { Plus, Trash } from 'lucide-react';
import useFetch from '../../hooks/useFetch';


const ClaimManage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const {data} = useFetch(`${apiUrl}/api/getClaim`);


  return (
    <div className='w-full h-screen'>

      <Button variant="primary" size="md" icon={Plus}>Add Claim</Button>


      
    </div>
  )
}

export default ClaimManage