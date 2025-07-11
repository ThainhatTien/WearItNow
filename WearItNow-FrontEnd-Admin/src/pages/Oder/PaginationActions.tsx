import React from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

interface PaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const PaginationActions: React.FC<PaginationActionsProps> = ({ count, page, rowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, totalPages - 1);
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      {Array.from({ length: totalPages }, (_, index) => (
        <Typography
          key={index}
          onClick={(event) => onPageChange(event as React.MouseEvent<HTMLButtonElement>, index)}
          sx={{
            mx: 1,
            cursor: 'pointer',
            fontWeight: page === index ? 'bold' : 'normal',
            color: page === index ? 'primary.main' : 'inherit',
          }}
        >
          {index + 1}
        </Typography>
      ))}
      <IconButton onClick={handleNextButtonClick} disabled={page >= totalPages - 1}>
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= totalPages - 1}>
        <LastPage />
      </IconButton>
    </Box>
  );
};

export default PaginationActions;
