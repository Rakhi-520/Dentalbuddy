import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserRoleProvider } from './context/UserRoleContext';

import Layout from './components/Layout';
import LoginPage from './Pages/LoginPage';
import Home from './Pages/Home';
import PageAccessConfig from './Pages/PageAccessConfig';

import PatientFormA from './Features/Patient/PatientFormA';
import PatientFormB from './Features/Patient/PatientFormB';

import PatientList from './Features/Patient/PatientList';
 
import CaseSheetViewer from './Features/Patient/CaseSheetViewer';
import AppointmentPage from './Pages/Appointment';
import StockPage from './Pages/Inventory';
import InventoryNotes from './components/InventoryNotes';
import FinancePage from './Pages/Finance';
import PatientRecords from './Pages/PatientRecords'; 
import DentalBuddySearch from './Pages/DentalBuddySearch';
import DentalAssistant from './Features/DentalAssistant/DentalAssistant';
import IllustrationsPage from './Features/Illustrations/IllustrationsPage';
import DentalDiary from './Pages/DentalDiary';
import UserManagement from './Pages/AdminPanel/UserManagement';
import RoleManagement from './Pages/AdminPanel/RoleManagement';






function App() {
  return (
    <UserRoleProvider>
      <Router>
        <Routes>
          {/* 🔓 Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* 🔒 Protected Routes inside Layout */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/config" element={<PageAccessConfig />} />
            <Route path="/patient-form-a" element={<PatientFormA />} />
            <Route path="/patient-form-b" element={<PatientFormB />} />


            {/* Patient Section */}
            <Route path="/patient-records" element={<PatientRecords />} />
            <Route path="/patients-list" element={<PatientList />} />
            <Route path="/patients/:id" element={<CaseSheetViewer />} />

            {/* Other Modules */}
            <Route path="/appointments" element={<AppointmentPage />} />
            <Route path="/search" element={<DentalBuddySearch />} />
            <Route path="/dental-assistant" element={<DentalAssistant />} />
            <Route path="/illustrations" element={<IllustrationsPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/inventory-notes" element={<InventoryNotes />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/notes" element={<DentalDiary />} />
            <Route path="/admin-panel" element={<UserManagement />} />
            <Route path="/admin-panel/roles" element={<RoleManagement />} />


          </Route>
        </Routes>
      </Router>
    </UserRoleProvider>
  );
}

export default App;
