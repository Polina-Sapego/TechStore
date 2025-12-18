import React from 'react';
import { Box, Skeleton } from '@mui/material';

const ROWS = 5;

const AdminTableSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', p: 2 }}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton
            key={idx}
            variant="rectangular"
            height={40}
            sx={{
              flex: idx === 1 ? '0 0 50px' : '1',
              borderRadius: idx === 0 ? '8px 0 0 0' : idx === 5 ? '0 8px 0 0' : 0,
              mx: idx === 0 ? 0 : 1,
            }}
          />
        ))}
      </Box>

      {Array.from({ length: ROWS }).map((_, rowIdx) => (
        <Box
          key={rowIdx}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            gap: 1,
            borderTop: '1px solid #e0e0e0',
            transition: 'transform 0.2s',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              transform: 'scale(1.01)',
            },
          }}
        >

          <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 2 }} />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>

          <Skeleton variant="text" width={80} height={20} />

          <Skeleton variant="text" width={60} height={20} />

          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default AdminTableSkeleton;
