import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Newspaper, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                  <Newspaper />
                  NewsApp
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                {!user ? (
                  <>
                    <Link
                      to="/auth"
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                    >
                      <LogIn size={20} />
                      Login
                    </Link>
                    <Link
                      to="/reg"
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                    >
                      <UserPlus size={20} />
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/profile/${user.id}`}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                    >
                      <User size={20} />
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/profile/:id" 
              element={user ? <ProfilePage /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/" /> : <AuthForm type="login" />} 
            />
            <Route 
              path="/reg" 
              element={user ? <Navigate to="/" /> : <AuthForm type="register" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;