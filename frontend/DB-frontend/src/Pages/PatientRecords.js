import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Grid, Card, CardContent,
  Modal, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import PatientFormA from '../Features/Patient/PatientFormA';
import PatientFormB from '../Features/Patient/PatientFormB';
import ImportantNotePR from '../components/ImportantNotePR';
import { useUserRole } from '../context/UserRoleContext';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: '1000px',
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
};

const PatientRecords = () => {
  const { role } = useUserRole();
 
const allowedRoles = ['admin', 'doctor', 'assistant', 'dental nurse', 'dental assistant'];

const canViewSectionB = allowedRoles.includes(role?.toLowerCase());


  const [openFormModal, setOpenFormModal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments/today');
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    const fetchRecentPatients = async () => {
      try {
        const res = await fetch('/api/patients/recent');
        const data = await res.json();
        setRecentPatients(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };

    fetchAppointments();
    fetchRecentPatients();
  }, []);

  return (
    <Box sx={{ padding: '30px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography
  variant="h4"
  align="center"
  sx={{
    fontWeight: 'bold',
    color: '#2a97c9ff ',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    mb: 4,
  }}
>
  <span role="img" aria-label="file"></span> PATIENT RECORDS
</Typography>


      {/*Important Note Button */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#2a97c9ff ', fontWeight: 600, borderRadius: '8px' }}
          onClick={() => setOpenNoteModal(true)}
        >
          📝 Important Notes for Admin
        </Button>
      </Box>

      {/* Modal for Important Notes */}
      <Modal open={openNoteModal} onClose={() => setOpenNoteModal(false)}>
        <Box sx={modalStyle}>
          <ImportantNotePR />
        </Box>
      </Modal>

      {/* New Case & Patient List */}
      <Grid container spacing={12} justifyContent="center">
        <Grid item xs={14} md={5.5}>
          <Card sx={{ borderRadius: '12px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🆕 New Case Sheet</Typography>
              <Typography variant="body2">Start a new case sheet for a patient.</Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#2a97c9ff ', mt: 2 }}
                onClick={() => setOpenFormModal(true)}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5.5}>
          <Card sx={{ borderRadius: '12px', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>📂 Patient List</Typography>
              <Typography variant="body2">View and manage your full patient list.</Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#2a97c9ff ', mt: 2 }}
                onClick={() => window.location.href = '/patients-list'}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Case Sheet Modal */}
     {/* Case Sheet Modal */}
<Modal open={openFormModal} onClose={() => setOpenFormModal(false)}>
  <Box sx={modalStyle}>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center', color: '#2a97c9ff' }}>
      New Case Sheet
    </Typography>

    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 'bold', color: '#2a97c9ff' }}>
          Section A - Patient Form A
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <PatientFormA />
      </AccordionDetails>
    </Accordion>

    {canViewSectionB && (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold', color: '#2a97c9ff' }}>
            Section B - Patient Form B
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PatientFormB />
        </AccordionDetails>
      </Accordion>
    )}
  </Box>
</Modal>


      {/* Today's Appointments */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          📅 Today's Appointments
        </Typography>
        {appointments.length === 0 ? (
          <Typography color="text.secondary">No appointments scheduled today.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>{a.time}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.department}</TableCell>
                  <TableCell>{a.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>

      {/* Recent Patients */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          🧾 Recent Patients
        </Typography>
        {recentPatients.length === 0 ? (
          <Typography color="text.secondary">No recent patients.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Diagnosis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentPatients.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.diagnosis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default PatientRecords;
