import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

const Sidebar = () => {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/admin/items">
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Objets Perdus" />
        </ListItemButton>
      </ListItem>
      
      <ListItem disablePadding>
        <ListItemButton component={Link} to="/admin/messages">
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default Sidebar; 