import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Item } from '../../types';
import { ITEM_STATUS, ITEM_TYPE } from '../../services/mockData';

interface ItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<Item>) => Promise<void>;
  item: Item | null;
  title: string;
}

const ItemDialog: React.FC<ItemDialogProps> = ({
  open,
  onClose,
  onSave,
  item,
  title,
}) => {
  const [formData, setFormData] = useState<Partial<Item>>({
    description: '',
    location: '',
    type: 'Lost' as const,
    status: 'pending' as const,
    imageUrl: '',
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        description: '',
        location: '',
        type: 'Lost' as const,
        status: 'pending' as const,
        imageUrl: '',
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as typeof ITEM_TYPE[keyof typeof ITEM_TYPE];
    setFormData({ ...formData, type: value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as typeof ITEM_STATUS[keyof typeof ITEM_STATUS];
    setFormData({ ...formData, status: value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {title}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              multiline
              rows={3}
            />
            <TextField
              label="Localisation"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <TextField
              select
              label="Type"
              value={formData.type}
              onChange={handleTypeChange}
              required
            >
              {Object.entries(ITEM_TYPE).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Statut"
              value={formData.status}
              onChange={handleStatusChange}
              required
            >
              {Object.entries(ITEM_STATUS).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="URL de l'image"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            {item ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ItemDialog; 