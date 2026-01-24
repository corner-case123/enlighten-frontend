 "use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import components with SSR disabled
const DashboardContainer = dynamic(
  () => import('@/container/DashboardContainer'),
  { ssr: false }
);

const Blog = dynamic(
  () => import('@/components/admin/Blog'),
  { ssr: false }
);

const DashboardPage = () => {
    return (
        <DashboardContainer>
            <Blog/>
        </DashboardContainer>
    );
};

export default DashboardPage;