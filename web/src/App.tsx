import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import DefectListPage from './pages/DefectListPage';
import CreateDefectPage from './pages/CreateDefectPage';
import EditDefectPage from './pages/EditDefectPage';
import UserListPage from './pages/UserListPage';
import ProtectedRoute from './components/ProtectedRoute';
import ViewDefectPage from './pages/ViewDefectPage';


function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar/>
      <main className="container mx-auto">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute component={DefectListPage} />} />
          <Route path="/defects" element={<ProtectedRoute component={DefectListPage} />} />
          <Route path="/defects/new" element={<ProtectedRoute component={CreateDefectPage} />} />
          <Route path="/defects/edit/:id" element={<ProtectedRoute component={EditDefectPage} />} />
          <Route path="/users" element={<ProtectedRoute component={UserListPage} />} />
          <Route path="/defects/view/:id" element={<ProtectedRoute component={ViewDefectPage} />} />
          
   
        </Routes>
      </main>
    </div>
  );
}

export default App;
