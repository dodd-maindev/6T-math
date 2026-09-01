import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './Pages/HomePages';
import Introduction from './Pages/Introduction';
import Contact from './Pages/Contact';
import CourseDetail from './Pages/CourseDetail';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import ContactIcons from './components/Statics/Contact';
import Header from './components/Statics/Header';
import Footer from './components/Statics/Footer';

/**
 * Public layout wrapper displaying standard website navbar, contact icons, and footer.
 */
const PublicLayout = ({ children }) => (
  <>
    <Header />
    <ContactIcons />
    {children}
    <Footer />
  </>
);

/**
 * Main App shell establishing routing, contexts, global layouts, and guards.
 */
function App() {
  document.title = '6T MATH';
  return (
    <AuthProvider>
      <Router>
        <div className="App overflow-x-hidden">
          <Routes>
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/introduction" element={<PublicLayout><Introduction /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/course/:id" element={<PublicLayout><CourseDetail /></PublicLayout>} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;