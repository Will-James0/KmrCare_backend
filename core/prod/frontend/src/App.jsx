import { useGSAP } from "@gsap/react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Catalogue from "./pages/Catalogue";
import EnSavoirPlus from "./Acceuil/views/EnSavoirPlus";
import Authentification from "./pages/Authentification";
import LoginPatient from "./pages/LoginPatient";
import LoginDoctor from "./pages/LoginDoctor";
import LoginAdmin from "./pages/LoginAdmin";
import LoginRedirect from "./pages/LoginRedirect";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterDoctor from "./pages/RegisterDoctor";
import RegisterSelection from "./pages/RegisterSelection";
import RegisterRedirect from "./pages/RegisterRedirect";
import RegisterDoctorConfirm from "./pages/RegisterDoctorConfirm";
import Reservations from "./pages/Reservations";
import Load from "./pages/Loader";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import gsap from "gsap";
import { DivWrapper } from "./Acceuil/views/DivWrapper";
import UserPreferences from "./pages/UserPreferences";
import HomeDoctor from "./pages/Doctors/HomeDoctor";

// Import des pages Patient
import PatientDashboard from "./pages/PatientDashboard";
import PatientReservation from "./pages/PatientReservation";
import PatientHistory from "./pages/Patient/PatientHistory";

// Import des guards et composants d'authentification
import { AuthGuard, AdminGuard, DispensaryGuard, GuestGuard } from "./guards";
import AuthProvider from "./components/AuthProvider";
import RouteRedirect from "./components/RouteRedirect";

// Import du système de notifications global
import NotificationCenter from "./components/ui/NotificationCenter";

// Import de l'Error Boundary global
import ErrorBoundary from "./components/ErrorBoundary";

// Import des utilitaires de store pour l'initialisation
import { initializeStores } from "./_store";
import { useEffect } from "react";

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Initialiser les stores au démarrage de l'application
  useEffect(() => {
    initializeStores();
  }, []);

  useGSAP(() => {
    if (isHomePage) {
      // Masquer la scrollbar verticale au début de l'animation (horizontale reste masquée par CSS)
      document.body.style.overflowY = 'hidden';
      
      let tl = gsap.timeline();
      //Animation de defragmentation
      tl.to(".box", {
       scale: 0,
       y: 60,
       rotate: 400,
       duration: 0.4,
       yoyo: true,
       delay: 0.4,
       stagger: {
         amount: 1.5,
         from: "end",
         //axis: "x",
         grid: [3, 3],
       }
      });
      
      // Animation de disparition du wrapper et restauration de la scrollbar verticale
      tl.to(".wrapper", {
       opacity: 0,
       display: "none",
       onComplete: () => {
         // Restaurer seulement la scrollbar verticale (horizontale reste masquée)
         document.body.style.overflowY = 'auto';
       }
      });
    }
  }, [isHomePage]);

  return (
    <div>
      {isHomePage && <Load/>}        
      <RouteRedirect />
      
      {/* Centre de notifications global */}
      <NotificationCenter />
      
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/en-savoir-plus" element={<EnSavoirPlus />} />
        <Route path="/services" element={<DivWrapper/>} />
        
        {/* Route d'authentification principale - seulement pour les non-connectés */}
        <Route 
          path="/auth" 
          element={
            <GuestGuard>
              <Authentification />
            </GuestGuard>
          } 
        />
        
        {/* Routes de connexion séparées - seulement pour les non-connectés */}
        <Route 
          path="/login-patient" 
          element={
            <GuestGuard>
              <LoginPatient />
            </GuestGuard>
          } 
        />
        <Route 
          path="/login-doctor" 
          element={
            <GuestGuard>
              <LoginDoctor />
            </GuestGuard>
          } 
        />
        <Route 
          path="/login-admin" 
          element={
            <GuestGuard>
              <LoginAdmin />
            </GuestGuard>
          } 
        />
        
        {/* Route de compatibilité /login avec redirection intelligente */}
        <Route 
          path="/login" 
          element={
            <GuestGuard>
              <LoginRedirect />
            </GuestGuard>
          } 
        />
        
        {/* Routes d'inscription séparées - seulement pour les non-connectés */}
        <Route 
          path="/register-patient" 
          element={
            <GuestGuard>
              <RegisterPatient />
            </GuestGuard>
          } 
        />
        <Route 
          path="/register-doctor" 
          element={
            <GuestGuard>
              <RegisterDoctor />
            </GuestGuard>
          } 
        />
        <Route 
          path="/register-selection" 
          element={
            <GuestGuard>
              <RegisterSelection />
            </GuestGuard>
          } 
        />
        <Route 
          path="/register-doctor-confirm" 
          element={
            <GuestGuard>
              <RegisterDoctorConfirm />
            </GuestGuard>
          } 
        />
        
        {/* Route de compatibilité /register avec redirection intelligente */}
        <Route 
          path="/register" 
          element={
            <GuestGuard>
              <RegisterRedirect />
            </GuestGuard>
          } 
        />
        
        {/* Ancienne route d'inscription générique - redirection vers sélection */}
        <Route 
          path="/register-dispensary" 
          element={
            <GuestGuard>
              <RegisterRedirect />
            </GuestGuard>
          } 
        />
        
        {/* Routes protégées - nécessitent une authentification */}
        <Route 
          path="/reservations" 
          element={
            <AuthGuard>
              <Reservations />
            </AuthGuard>
          } 
        />
        
        {/* Routes administrateur - nécessitent le rôle admin */}
        <Route 
          path="/admin" 
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          } 
        />
        
        {/* Routes médecin - nécessitent le rôle doctor */}
        <Route 
          path="/dispensary" 
          element={
            <DispensaryGuard>
              <HomeDoctor />
            </DispensaryGuard>
          } 
        />
        
        {/* Routes patient - nécessitent le rôle patient/user */}
        <Route 
          path="/patient" 
          element={
            <AuthGuard>
              <PatientDashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/reservation/:dispensaryToken" 
          element={
            <AuthGuard>
              <PatientReservation />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/history" 
          element={
            <AuthGuard>
              <PatientHistory />
            </AuthGuard>
          } 
        />
        
        {/* Route de préférences - nécessite une authentification */}
        <Route 
          path="/preferences" 
          element={
            <AuthGuard>
              <UserPreferences />
            </AuthGuard>
          } 
        />
        
        {/* Route 404 - doit être en dernier */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
};

export default App;
