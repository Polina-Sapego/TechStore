import { Box, Skeleton } from '@mui/material';
import { CategorySkeleton } from './CategorySkeleton';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export const HomePageSkeleton = () => {
  return (
    <Box className="home-page">
      <Box className="tech-store-category-buttons" display="flex" justifyContent="center" gap={2}>
        {Array.from({ length: 4 }).map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </Box>

      <Box className="tech-store-grid-section" maxWidth="1200px" mx="auto" px={2} display="flex"
           flexDirection="column" gap={3}>

        <Box className="tech-store-grid-sort" alignSelf="flex-end" display="flex"
             alignItems="center" gap={1}>
          <Skeleton variant="text" width={80} height={24}
                    animation="wave" /> {/* Label "Sort by price:" */}
          <Skeleton variant="rectangular" width={120} height={36} animation="wave" /> {/* select */}
        </Box>

        <Box className="product-grid" display="grid"
             gridTemplateColumns="repeat(auto-fill,minmax(240px,1fr))" gap={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
