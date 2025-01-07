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
  Input,
} from '@mui/material';
import { Close as CloseIcon, PhotoCamera } from '@mui/icons-material';
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
  const [formData, setFormData] = useState<Partial<Item>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        description: item.description,
        location: item.location,
        type: item.type,
        status: item.status,
        imageUrl: item.imageUrl,
        category: item.category,
      });
      setImagePreview(item.imageUrl || null);
    } else {
      setFormData({});
      setImagePreview(null);
    }
  }, [item, open]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {title}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
            onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof ITEM_TYPE[keyof typeof ITEM_TYPE] })}
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
            onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof ITEM_STATUS[keyof typeof ITEM_STATUS] })}
            required
          >
            {Object.entries(ITEM_STATUS).map(([key, value]) => (
              <MenuItem key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                fullWidth
              >
                {imagePreview ? 'Changer l\'image' : 'Ajouter une image'}
              </Button>
            </label>
          </Box>
          {(imagePreview || formData.imageUrl) && (
            <Box
              sx={{
                width: '100%',
                height: 200,
                backgroundImage: `url(${imagePreview || formData.imageUrl})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 1,
                border: '1px solid #ddd',
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={() => onSave(formData)} variant="contained">
          {item ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemDialog; 