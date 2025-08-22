import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";
import CTDLogo from "./CTDLogo";

const Header = () => {
  const { user, isAuthenticated, logout, isMentor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="flex items-center space-x-3"
          >
            <CTDLogo size="small" variant="light" />
            <span className="text-white text-xl font-bold">MentorHub</span>
          </Link>

          {/* Navigation */}
          {isAuthenticated ? (
            <nav className="flex items-center space-x-6">
              {/* Common navigation for all authenticated users */}
              <Link
                to={ROUTES.DASHBOARD}
                className="text-white hover:text-orange-300 transition-colors"
              >
                Dashboard
              </Link>

              <Link
                to={ROUTES.SESSIONS}
                className="text-white hover:text-orange-300 transition-colors"
              >
                Sessions
              </Link>

              <Link
                to={ROUTES.RECORDINGS}
                className="text-white hover:text-orange-300 transition-colors"
              >
                Recordings
              </Link>

              {/* Mentor-only navigation */}
              {isMentor() && (
                <Link
                  to={ROUTES.CREATE_SESSION}
                  className="text-white hover:text-orange-300 transition-colors"
                >
                  Create Session
                </Link>
              )}

              {/* User profile and logout */}
              <div className="flex items-center space-x-4 ml-6 border-l border-white/20 pl-6">
                <Link
                  to={ROUTES.PROFILE}
                  className="text-white hover:text-orange-300 transition-colors"
                >
                  Profile
                </Link>

                <span className="text-white/80 text-sm">
                  {user?.firstName} {user?.lastName}
                  <span className="ml-1 text-xs bg-accent text-white px-2 py-1 rounded">
                    {user?.role}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="text-white hover:text-orange-300 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </nav>
          ) : (
            /* Public navigation */
            <nav className="flex items-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-white hover:text-orange-300 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
