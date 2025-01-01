import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  styled,
} from '@mui/material';

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
}));

interface FiltersProps {
  filters: {
    status: string;
    type: string;
    date: string;
    category: string;
  };
  onFilterChange: (name: string, value: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <FiltersContainer>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Statut</InputLabel>
        <Select
          value={filters.status}
          label="Statut"
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <MenuItem value="all">Tous</MenuItem>
          <MenuItem value="lost">Perdus</MenuItem>
          <MenuItem value="found">Trouvés</MenuItem>
          <MenuItem value="claimed">Réclamés</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={filters.category}
          label="Catégorie"
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <MenuItem value="all">Toutes</MenuItem>
          <MenuItem value="electronics">Électronique</MenuItem>
          <MenuItem value="documents">Documents</MenuItem>
          <MenuItem value="accessories">Accessoires</MenuItem>
          <MenuItem value="other">Autres</MenuItem>
        </Select>
      </FormControl>

      <TextField
        type="date"
        label="Date"
        value={filters.date}
        onChange={(e) => onFilterChange('date', e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </FiltersContainer>
  );
};

export default Filters; 