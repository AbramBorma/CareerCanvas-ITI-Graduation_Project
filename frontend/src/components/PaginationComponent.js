import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import '../static/styles/SupervisorDashboard.css'; // Import your CSS

export default function PaginationRounded({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const count = Math.ceil(totalItems / itemsPerPage);

  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Stack spacing={2} className="pagination">
      <Pagination
        count={count}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}