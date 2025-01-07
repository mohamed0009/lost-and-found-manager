import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActionArea
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardActionArea onClick={onClick} sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            position: 'relative',
            paddingTop: '60%',
            backgroundImage: `url(${item.imageUrl || '/placeholder.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <Chip
            label={item.type === 'Lost' ? 'Perdu' : 'Trouvé'}
            color={item.type === 'Lost' ? 'error' : 'success'}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="h6" gutterBottom noWrap>
            {item.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {item.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(item.reportedDate).toLocaleDateString('fr-FR')}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ItemCard; 