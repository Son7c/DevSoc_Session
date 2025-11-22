import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEditPost from './pages/CreateEditPost';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import useAuthStore from './store/authStore';

function App() {
  const { refreshUser } = useAuthStore();

  useEffect(() => {
    // Ensure user is loaded from localStorage on app start
    refreshUser();
  }, [refreshUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-post" element={<CreateEditPost />} />
            <Route path="/edit-post/:id" element={<CreateEditPost />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
