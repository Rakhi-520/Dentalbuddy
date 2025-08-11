import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  InputBase,
  IconButton,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../context/UserRoleContext';

const NavbarSearchModal = () => {
  const { role } = useUserRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Open modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSearch = () => {
    const lowerQuery = query.toLowerCase().trim();

    // Match common navigation keywords
    if (
      lowerQuery.includes('finance') ||
      lowerQuery.includes('billing') ||
      lowerQuery.includes('profit')
    ) {
      navigate('/finance');
    } else if (
      lowerQuery.includes('settings') ||
      lowerQuery.includes('config') ||
      lowerQuery.includes('permissions')
    ) {
      navigate('/config');
    } else if (
      lowerQuery.includes('inventory') ||
      lowerQuery.includes('stock') ||
      lowerQuery.includes('medicines')
    ) {
      navigate('/stock');
    } else if (
      lowerQuery.includes('appointments') ||
      lowerQuery.includes('schedule')
    ) {
      navigate('/appointments');
    } else if (
      lowerQuery.includes('ai') ||
      lowerQuery.includes('assistant')
    ) {
      navigate('/ai-assistant');
    } else if (
      lowerQuery.includes('patient') ||
      /^\d{10}$/.test(lowerQuery) ||  // phone
      /^[a-zA-Z\s]+$/.test(lowerQuery) // name
    ) {
      navigate('/patients');
      // Optionally store query to use in PatientList page
      localStorage.setItem('globalSearchQuery', query);
    } else {
      alert('Sorry, I could not understand your request.');
    }

    handleClose();
  };

  // Only show if admin
  if (role !== 'admin') return null;

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <SearchIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>🔍 Search the App (Admin Assistant)</DialogTitle>
        <DialogContent>
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            sx={{ display: 'flex', alignItems: 'center', p: '4px 10px', mt: 1 }}
          >
            <InputBase
              autoFocus
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search: patients, settings, finance, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavbarSearchModal;
