'use client';

import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      placeholder="Search by task title or description"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#9CA3AF' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#E5E7EB',
          },
          '&:hover fieldset': {
            borderColor: '#D1D5DB',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4F46E5',
            borderWidth: '2px',
          },
        },
        '& input': {
          py: 1.5,
        },
      }}
    />
  );
}

