import { Box, Button, Typography, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Pagination({ page, setPage, hasNextPage }) {
  return (
    <Stack
      direction="row"
      spacing={3}
      justifyContent="center"
      alignItems="center"
      mt={4}
    >
      {/* Prev Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        disabled={page === 0}
        onClick={() => setPage((p) => p - 1)}
        sx={{ paddingX: 3 }}
      >
        Prev
      </Button>

      {/* Page Info */}
      <Typography variant="h6">Page {page + 1}</Typography>

      {/* Next Button */}
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        disabled={!hasNextPage}
        onClick={() => setPage((p) => p + 1)}
        sx={{ paddingX: 3 }}
      >
        Next
      </Button>
    </Stack>
  );
}
