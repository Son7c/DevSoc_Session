import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, reset } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    logout();
    reset();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-panel py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              BlogApp
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/create-post"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/create-post') ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Write
                </Link>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/login') ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 focus:outline-none p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <button
                    onClick={onLogout}
                    className="text-sm text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </div>
                <Link
                  to="/create-post"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-serif text-gray-900"
                >
                  Write a Story
                </Link>
              </>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-serif text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-serif text-gray-900"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
