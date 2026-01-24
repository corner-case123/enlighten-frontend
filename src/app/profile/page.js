"use client";

import Profile from '@/components/profile/Profile'
import React from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <div>
        <Profile/>
      </div>
    </ProtectedRoute>
  )
}

export default ProfilePage