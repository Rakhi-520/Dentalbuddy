import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [timeSlots, setTimeSlots] = useState([
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  ]);
  const [openEditSlots, setOpenEditSlots] = useState(false);
  const [openEditPatient, setOpenEditPatient] = useState(false);
  const [newSlot, setNewSlot] = useState('');

const dateKey = selectedDate.toISOString().split('T')[0];
const appointments = JSON.parse(localStorage.getItem('appointments')) || {};
const bookedSlots = appointments[dateKey] || [];


  const handleAddSlot = () => {
    if (newSlot.trim() && !timeSlots.includes(newSlot)) {
      setTimeSlots([...timeSlots, newSlot]);
      setNewSlot('');
    }
  };

  const handleDeleteSlot = (slot) => {
    setTimeSlots(timeSlots.filter((t) => t !== slot));
  };

 const handleConfirm = () => {
  const dateKey = selectedDate.toISOString().split('T')[0]; // e.g., "2025-07-10"
  const appointments = JSON.parse(localStorage.getItem('appointments')) || {};

  // Prevent duplicate booking
  if (appointments[dateKey]?.includes(selectedTime)) {
    alert('Slot already booked!');
    return;
  }

  // Save booking
  const updated = {
    ...appointments,
    [dateKey]: [...(appointments[dateKey] || []), selectedTime],
  };

  localStorage.setItem('appointments', JSON.stringify(updated));

  alert(`Appointment booked for ${name} at ${selectedTime} on ${selectedDate.toDateString()}`);

  setName('');
  setPhone('');
  setReason('');
  setSelectedTime('');
};


  return (
    <Box p={3} sx={{ backgroundColor: '#e6f4f9', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: 'center', mb: 4, color: '#0077b6', fontWeight: 'bold', letterSpacing: '0.5px' }}
      >
        BOOK AN APPOINTMENT
      </Typography>

      {/* Centered Calendar */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Paper
          elevation={4}
          sx={{
            p: 2,
            backgroundColor: '#caf0f8',
            borderRadius: '16px',
            width: '100%',
            maxWidth: 450,
            display: 'flex',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 119, 182, 0.2)'
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              sx={{
                '& .MuiPickersDay-root': {
                  fontWeight: 'bold',
                  fontSize: '.8rem',
                  padding: '12px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px'
                },
                '& .MuiPickersDay-today': {
                  border: '2px solid #0077b6',
                  backgroundColor: '#e0f7fa',
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: '#0077b6',
                },
                '& .MuiTypography-root': {
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#0077b6'
                },
                '.MuiDayCalendar-header': {
                  justifyContent: 'space-around',
                },
                
                '&::-webkit-scrollbar': {
                 width: '6px',
                },
  
                '&::-webkit-scrollbar-thumb': {
                 backgroundColor: '#0077b6',
                 borderRadius: '10px',
                },
  
                '&::-webkit-scrollbar-track': {
                 backgroundColor: '#caf0f8',
                }
              }}
            />
          </LocalizationProvider>
        </Paper>
      </Box>

      {/* Time Slot and Form */}
      <Paper 
      elevation={4} 
      sx={{
         p: 2, 
         backgroundColor: '#caf0f8',
         borderRadius: '16px'}}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: '#0077b6' }}>Select Time Slot</Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setOpenEditSlots(true)}
            sx={{ borderColor: '#0077b6', color: '#0077b6' }}
          >
            Edit Slots
          </Button>
        </Box>

        <Grid container spacing={2} mt={1}>
         {timeSlots.map((time) => (
  <Grid item xs={6} sm={4} md={3} key={time}>
    <Button
      disabled={bookedSlots.includes(time)} // ✅ No comma here
      variant={selectedTime === time ? 'contained' : 'outlined'}
      fullWidth
      onClick={() => setSelectedTime(time)}
      startIcon={<AccessTimeIcon />}
      sx={{
        color: selectedTime === time ? '#ffffff' : '#0077b6',
        backgroundColor: selectedTime === time ? '#0077b6' : '#ffffff',
        borderColor: '#0077b6',
        '&:hover': {
          backgroundColor: selectedTime === time ? '#005f8a' : '#e0f7fa',
        },
        opacity: bookedSlots.includes(time) ? 0.5 : 1,
        cursor: bookedSlots.includes(time) ? 'not-allowed' : 'pointer',
      }}
    >
      {time}
    </Button>
  </Grid>
))}

        </Grid>

        <Box mt={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: '#0077b6' }}>Patient Details</Typography>
            {(name || phone || reason) && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setOpenEditPatient(true)}
                sx={{ borderColor: '#0077b6', color: '#0077b6' }}
              >
                Edit
              </Button>
            )}
          </Box>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '10px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Reason for Visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          ></textarea>
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirm}
            sx={{ mt: 2, backgroundColor: '#0077b6', '&:hover': { backgroundColor: '#005f8a' } }}
          >
            Confirm Appointment
          </Button>
        </Box>
      </Paper>

      {/* Edit Time Slot Dialog */}
      <Dialog open={openEditSlots} onClose={() => setOpenEditSlots(false)} fullWidth maxWidth="xs">
        <DialogTitle>Edit Time Slots</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {timeSlots.map((slot) => (
              <Grid item xs={6} key={slot}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography>{slot}</Typography>
                  <IconButton size="small" onClick={() => handleDeleteSlot(slot)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
          <input
            type="text"
            placeholder="New Slot (e.g. 5:00 PM)"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditSlots(false)}>Close</Button>
          <Button onClick={handleAddSlot} variant="contained">Add Slot</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Patient Details Dialog */}
      <Dialog
        open={openEditPatient}
        onClose={() => setOpenEditPatient(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: 'center', color: '#0077b6' }}>
          ✏️ Edit Patient Details
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Box component="form" autoComplete="off">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <textarea
              placeholder="Reason for Visit"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              style={{ width: '100%', padding: '10px' }}
            ></textarea>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenEditPatient(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenEditPatient(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointment;
