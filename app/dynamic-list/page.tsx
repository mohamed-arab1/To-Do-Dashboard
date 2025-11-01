'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Alert,
  Fade,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';

export default function DynamicListPage() {
  const [items, setItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  const [inputValue, setInputValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [deletingItems, setDeletingItems] = useState<Set<number>>(new Set());

  const handleAddItem = () => {
    if (inputValue.trim() === '') {
      // Show error message
      setShowError(true);
      
      // Fade out after 2 seconds
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      
      return;
    }

    // Add item to list
    setItems([...items, inputValue.trim()]);
    
    // Clear input
    setInputValue('');
  };

  const handleDeleteItem = (index: number) => {
    // Add to deleting set for fade-out animation
    setDeletingItems(new Set(deletingItems).add(index));
    
    // Remove after animation completes (500ms)
    setTimeout(() => {
      setItems(items.filter((_, i) => i !== index));
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: '#fafafa',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight={700}
          gutterBottom
          sx={{ color: '#2c3e50' }}
        >
          Dynamic List
        </Typography>

        {/* Input Section */}
        <Box display="flex" gap={2} mb={3} mt={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter a new item"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#5b7c99',
                },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddItem}
            sx={{
              bgcolor: '#5b7c99',
              minWidth: '140px',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#4a6580',
              },
            }}
          >
            Add Item
          </Button>
        </Box>

        {/* Error Message */}
        <Fade in={showError} timeout={300}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              display: showError ? 'flex' : 'none',
            }}
          >
            Please enter an item
          </Alert>
        </Fade>

        {/* List Section */}
        <Box
          sx={{
            borderTop: '2px solid #ddd',
            pt: 2,
          }}
        >
          <List sx={{ width: '100%' }}>
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: { duration: 0.5 },
                  }}
                  style={{
                    overflow: 'hidden',
                  }}
                >
                  <ListItem
                    sx={{
                      bgcolor: 'white',
                      mb: 1,
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      opacity: deletingItems.has(index) ? 0.5 : 1,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteItem(index)}
                        sx={{
                          color: '#666',
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          px: 2,
                          '&:hover': {
                            bgcolor: '#fee',
                            color: '#d32f2f',
                            borderColor: '#d32f2f',
                          },
                        }}
                      >
                        Delete
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        fontSize: '1.1rem',
                        fontWeight: 400,
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </Box>

        {/* Back to Kanban Link */}
        <Box mt={4} textAlign="center">
          <Button
            variant="text"
            href="/"
            sx={{
              color: '#5b7c99',
              '&:hover': {
                bgcolor: '#f0f4f8',
              },
            }}
          >
            ← Back to Kanban Board
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

