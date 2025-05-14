import React from 'react';
import { Toaster } from "sonner"
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage'; 
import LocalCarPage from '@/pages/LocalCarPage';
import InternationalCarPage from '@/pages/InternationalCarPage';
import AppointmentPage from './pages/AppointmentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import SuccessPage from './pages/SuccessPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfileLayout from './pages/profile/ProfileLayout';
import AdminDashboard from './pages/AdminDashboard';
import CarsPage from './pages/CarsPage';
import CentreAide from './pages/CentreAide';
import ContacterAgent from './pages/ContacterAgent';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/help-center" element={<CentreAide />} />
        <Route path="/contact-agent" element={<ContacterAgent />} />
        <Route path="/local-car" element={<LocalCarPage />} />
        <Route path="/international-car" element={<InternationalCarPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/appointment/confirmation" element={<ConfirmationPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="cars" element={<CarsPage />} /> 
        </Route>
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </>
  );
};

export default App;
