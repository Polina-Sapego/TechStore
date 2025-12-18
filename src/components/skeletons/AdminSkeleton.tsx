import React from 'react';
import { Box, Skeleton } from '@mui/material';
import AdminTableSkeleton from './AdminTableSkeleton';

const AdminSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: 1200,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        py: 4,
      }}
    >

      <Skeleton variant="text" width="40%" height={40} sx={{ borderRadius: 1 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          gap: 2,
          height: '100px',
        }}
      >
        <Skeleton variant="text" width="20%" height={30} />
        <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: 2 }} />
      </Box>

      <AdminTableSkeleton />
    </Box>
  );
};

export default AdminSkeleton;
