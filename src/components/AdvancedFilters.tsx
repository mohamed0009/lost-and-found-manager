import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AdvancedFiltersProps {
  filters: {
    status: string[];
    categories: string[];
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    locations: string[];
  };
  onFilterChange: (name: string, value: any) => void;
  onResetFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Statut</InputLabel>
          <Select
            multiple
            value={filters.status}
            onChange={(event) => onFilterChange('status', event.target.value)}
            input={<OutlinedInput label="Statut" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            <MenuItem value="lost">Perdu</MenuItem>
            <MenuItem value="found">Trouvé</MenuItem>
            <MenuItem value="claimed">Réclamé</MenuItem>
            <MenuItem value="returned">Retourné</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Catégories</InputLabel>
          <Select
            multiple
            value={filters.categories}
            onChange={(event) => onFilterChange('categories', event.target.value)}
            input={<OutlinedInput label="Catégories" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            <MenuItem value="electronics">Électronique</MenuItem>
            <MenuItem value="documents">Documents</MenuItem>
            <MenuItem value="accessories">Accessoires</MenuItem>
            <MenuItem value="clothing">Vêtements</MenuItem>
            <MenuItem value="other">Autres</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <DatePicker
            label="Date début"
            value={filters.dateRange.start}
            onChange={(date: Date | null) => onFilterChange('dateRange', { 
              ...filters.dateRange, 
              start: date 
            })}
          />
          <DatePicker
            label="Date fin"
            value={filters.dateRange.end}
            onChange={(date: Date | null) => onFilterChange('dateRange', { 
              ...filters.dateRange, 
              end: date 
            })}
          />
        </Box>

        <Button 
          variant="outlined" 
          onClick={onResetFilters}
          sx={{ alignSelf: 'flex-end' }}
        >
          Réinitialiser les filtres
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default AdvancedFilters; 