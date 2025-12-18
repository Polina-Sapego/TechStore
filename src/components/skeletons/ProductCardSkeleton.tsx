import { Box, Skeleton } from '@mui/material';

export const ProductCardSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
      }}
    >
      <Skeleton
        variant="rectangular"
        height={300}
        animation="wave"
      />

      <Box sx={{ p: '20px' }}>
        <Skeleton variant="rounded" height={20} width="70%" animation="wave" />

        <Skeleton
          variant="rounded"
          height={14}
          width="40%"
          sx={{ mt: '6px' }}
          animation="wave"
        />

        <Skeleton
          variant="rounded"
          height={18}
          width="50%"
          sx={{ mt: '8px' }}
          animation="wave"
        />

        <Skeleton
          variant="rounded"
          height={32}
          width="100%"
          sx={{ mt: '12px', borderRadius: 2 }}
          animation="wave"
        />
      </Box>
    </Box>
  );
};
