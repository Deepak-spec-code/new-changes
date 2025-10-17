"use client"

import AdminPage from '@/components/pages/admin/AdminPage'
import UserDetails from '@/components/shared/UserDetails'
import React from 'react'
import { useSelector } from 'react-redux'



const AdminPageRouter = () => {

  const user = useSelector((state)=> state.user?.user?.ladder_id)

  return (
    <div className=''>
     
        <div>
          <AdminPage ladder_id={user} />
          
        </div>
    </div>
  )
}

export default AdminPageRouter