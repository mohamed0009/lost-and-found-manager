import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Send as SendIcon,
} from '@mui/icons-material';

interface Message {
  id: number;
  content: string;
  recipient: string;
  status: 'sent' | 'archived';
  timestamp: string;
}

const MessageManagement = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    content: '',
    recipient: '',
  });

  // Simuler le chargement des messages
  useEffect(() => {
    // Remplacer par un appel API réel
    setMessages([
      {
        id: 1,
        content: "Votre objet a été trouvé",
        recipient: "user@emsi.ma",
        status: 'sent',
        timestamp: new Date().toISOString(),
      },
      // ... autres messages
    ]);
  }, []);

  const handleSendMessage = () => {
    // Implémenter l'envoi de message
    setNewMessageOpen(false);
  };

  const handleArchiveMessage = (id: number) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, status: 'archived' } : msg
    ));
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Gestion des Messages
      </Typography>

      <Button
        variant="contained"
        startIcon={<SendIcon />}
        onClick={() => setNewMessageOpen(true)}
        sx={{ mb: 3 }}
      >
        Nouveau Message
      </Button>

      <List>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary={message.content}
              secondary={`Envoyé à : ${message.recipient} - ${new Date(message.timestamp).toLocaleString()}`}
            />
            <ListItemSecondaryAction>
              <Chip
                label={message.status}
                color={message.status === 'sent' ? 'success' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton
                edge="end"
                onClick={() => handleArchiveMessage(message.id)}
                sx={{ mr: 1 }}
              >
                <ArchiveIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDeleteMessage(message.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nouveau Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Destinataire"
            value={newMessage.recipient}
            onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Message"
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewMessageOpen(false)}>Annuler</Button>
          <Button onClick={handleSendMessage} variant="contained">
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageManagement; 