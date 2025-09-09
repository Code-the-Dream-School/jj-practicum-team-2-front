import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";
import CTDLogo from "./CTDLogo";
import { useState, useMemo } from "react";

const CONFIG = {
  styles: {
    navLink: "text-white hover:text-success transition-colors",
    button: "text-white hover:text-success transition-colors",
    avatar: "w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center",
    groupButton: (isActive) => `w-full text-left p-3 rounded-lg transition-colors ${
      isActive ? 'bg-success text-white' : 'bg-white/10 text-white hover:bg-white/20'
    }`,
    menuItem: "block text-white hover:text-success transition-colors py-2 text-sm pl-2 rounded hover:bg-white/10"
  },
  
  nav: {
    common: [
      { route: ROUTES.DASHBOARD, label: "Dashboard" },
      { route: ROUTES.SESSIONS, label: "Sessions" },
      { route: ROUTES.RECORDINGS, label: "Recordings" },
      { route: ROUTES.NOTIFICATIONS, label: "Notifications" },
    ],
    student: [
      { route: ROUTES.BROWSE_MENTORS, label: "Mentors" },
      { route: ROUTES.MY_SESSIONS, label: "My Sessions" },
    ],
    mentor: [
      { route: ROUTES.SESSION_MANAGEMENT, label: "Manage Sessions" },
      { route: ROUTES.STUDENTS, label: "Students" },
      { route: ROUTES.ATTENDANCE, label: "Attendance" },
      { route: ROUTES.REPORTS, label: "Reports" },
    ]
  },

  mobileGroups: {
    schedule: {
      title: "Schedule & Sessions",
      getItems: (userRole) => [
        { route: ROUTES.DASHBOARD, label: "Dashboard" },
        { route: ROUTES.SESSIONS, label: "Browse Sessions" },
        ...(userRole === 'student' ? [{ route: ROUTES.MY_SESSIONS, label: "My Sessions" }] : []),
        ...(userRole === 'mentor' ? [{ route: ROUTES.SESSION_MANAGEMENT, label: "Manage Sessions" }] : []),
        { route: ROUTES.RECORDINGS, label: "Recordings" }
      ]
    },
    community: {
      title: "People & Community",
      getItems: (userRole) => userRole === 'student' 
        ? [{ route: ROUTES.BROWSE_MENTORS, label: "Browse Mentors" }]
        : [
            { route: ROUTES.STUDENTS, label: "My Students" },
            { route: ROUTES.REPORTS, label: "Reports & Analytics" },
            { route: ROUTES.ATTENDANCE, label: "Attendance" }
          ]
    },
    account: {
      title: "Personal Settings", 
      getItems: () => [
        { route: null, label: "My Profile", isProfile: true },
        { route: ROUTES.NOTIFICATIONS, label: "Notifications" }
      ]
    }
  }
};

const Header = () => {
  const { user, isAuthenticated, logout, isMentor } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState('schedule');

  const userRole = useMemo(() => isMentor() ? 'mentor' : 'student', [isMentor]);
  const userInitials = useMemo(() => {
    if (!user?.firstName || !user?.lastName) return "?";
    return `${user.firstName[0]}${user.lastName[0]}`;
  }, [user]);
  const profileRoute = useMemo(() => 
    isMentor() ? ROUTES.MENTOR_PROFILE_PAGE : ROUTES.STUDENT_PROFILE, [isMentor]);
  const currentNavItems = useMemo(() => 
    [...CONFIG.nav.common, ...CONFIG.nav[userRole]], [userRole]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
    setIsMenuOpen(false);
  };

  const renderDesktopNav = () => (
    <nav className="hidden lg:flex items-center space-x-6">
      {currentNavItems.map((item) => (
        <Link key={item.route} to={item.route} className={CONFIG.styles.navLink}>
          {item.label}
        </Link>
      ))}
      <div className="flex items-center space-x-4 ml-6 border-l border-white/20 pl-6">
        <Link to={profileRoute} className={CONFIG.styles.navLink}>Profile</Link>
        <button onClick={handleLogout} className={`${CONFIG.styles.button} text-sm`}>
          Logout
        </button>
      </div>
    </nav>
  );

  const renderMobileNav = () => (
    <div className="lg:hidden flex items-center space-x-3">
      <div className={CONFIG.styles.avatar}>
        <span className="text-sm font-semibold text-gray-700">{userInitials}</span>
      </div>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-white hover:text-success transition-colors p-2"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );

  const renderGroupButton = (groupKey, group) => (
    <button
      key={groupKey}
      onClick={() => setActiveGroup(groupKey)}
      className={CONFIG.styles.groupButton(activeGroup === groupKey)}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{group.icon}</span>
        <span className="font-medium text-sm">{groupKey.charAt(0).toUpperCase() + groupKey.slice(1)}</span>
      </div>
    </button>
  );

  const renderGroupContent = () => {
    const group = CONFIG.mobileGroups[activeGroup];
    if (!group) return null;

    const items = group.getItems(userRole);

    return (
      <div>
        <h4 className="text-success font-semibold text-sm mb-3">{group.title}</h4>
        
        {activeGroup === 'account' && (
          <div className="bg-white/10 rounded-lg p-3 mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{userInitials}</span>
              </div>
              <div>
                <div className="text-white font-medium text-sm">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-success text-xs uppercase">{user?.role}</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.isProfile ? profileRoute : item.route}
              onClick={() => setIsMenuOpen(false)}
              className={CONFIG.styles.menuItem}
            >
              {item.label}
            </Link>
          ))}
          
          {activeGroup === 'account' && (
            <div className="pt-2 border-t border-white/20 mt-3">
              <button onClick={handleLogout} className={`block w-full text-left ${CONFIG.styles.menuItem}`}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMobileDropdown = () => (
    isAuthenticated && isMenuOpen && (
      <div className="lg:hidden bg-primary border-t border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-5 gap-4">
            {/* Group Buttons */}
            <div className="col-span-2 space-y-2">
              <h3 className="text-success font-semibold text-xs uppercase tracking-wide mb-3">
                Menu
              </h3>
              {Object.entries(CONFIG.mobileGroups).map(([key, group]) => 
                renderGroupButton(key, group)
              )}
            </div>

            {/* Group Content */}
            <div className="col-span-3 space-y-3">
              {renderGroupContent()}
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderGuestNav = () => (
    <nav className="flex items-center space-x-4">
      <Link to={ROUTES.LOGIN} className={CONFIG.styles.navLink}>Sign In</Link>
      <Link
        to={ROUTES.REGISTER}
        className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-success transition-colors"
      >
        Sign Up
      </Link>
    </nav>
  );

  return (
    <header className="bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="flex items-center space-x-3"
          >
            <CTDLogo size="small" variant="light" />
            <span className="text-white text-xl font-bold">MentorHub</span>
          </Link>

          {/* Navigation */}
          {isAuthenticated ? (
            <div className="flex items-center">
              {renderDesktopNav()}
              {renderMobileNav()}
            </div>
          ) : (
            renderGuestNav()
          )}
        </div>
      </div>

      {renderMobileDropdown()}
    </header>
  );
};

export default Header;