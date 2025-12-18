import { Box, Skeleton } from '@mui/material';

export const CategorySkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '1%',
        minWidth: '80px',
      }}
    >
      <Skeleton
        variant="circular"
        width={125}
        height={125}
        animation="wave"
      />

      <Skeleton
        variant="rounded"
        width={70}
        height={16}
        animation="wave"
      />
    </Box>
  );
};
