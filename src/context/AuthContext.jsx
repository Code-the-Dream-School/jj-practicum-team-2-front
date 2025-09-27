import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import { USER_ROLES } from "../utils/constants";
import { authStorage } from "../utils/cookies";
import { authReducer, initialState } from "./authReducer";
import { AUTH_ACTIONS } from "./authActions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authAPI.login(credentials);

      // Save token to localStorage immediately after successful login
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        console.log(
          "Token saved to localStorage:",
          response.token.substring(0, 20) + "...",
        );
      }

      // Backend automatically sets signed cookies
      // We only store user data for development fallback
      if (response.user) {
        authStorage.setUser(response.user);
      }

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
        },
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authAPI.register(userData);

      // Save token to localStorage immediately after successful registration
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        console.log(
          "Token saved to localStorage after registration:",
          response.token.substring(0, 20) + "...",
        );
      }

      // Backend automatically sets signed cookies
      // We only store user data for development fallback
      if (response.user) {
        authStorage.setUser(response.user);
      }

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: response.user,
        },
      });

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";

      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage token and local storage fallback and state
      localStorage.removeItem("authToken");
      authStorage.clearAuth();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const forceLogout = () => {
    localStorage.removeItem("authToken");
    authStorage.clearAuth();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const checkAuth = async () => {
    dispatch({ type: AUTH_ACTIONS.CHECK_AUTH_START });

    try {
      const response = await authAPI.checkAuth();

      // Save user data to localStorage as backup
      if (response.user) {
        authStorage.setUser(response.user);
      }

      dispatch({
        type: AUTH_ACTIONS.CHECK_AUTH_SUCCESS,
        payload: { user: response.user },
      });
    } catch (error) {
      // If API call fails, try to use saved user from localStorage as fallback
      const savedUser = authStorage.getUser();
      if (savedUser) {
        console.log("AuthContext: API failed, using saved user:", savedUser);
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_SUCCESS,
          payload: { user: savedUser },
        });
      } else {
        // No saved user, user is not authenticated
        dispatch({
          type: AUTH_ACTIONS.CHECK_AUTH_FAILURE,
          payload:
            error.response?.data?.message || "Authentication check failed",
        });
      }
    }
  };

  const updateUser = (newUserData) => {
    // Convert structure to match backend format if needed
    const backendUser = {
      id: newUserData.id,
      firstName:
        newUserData.firstName ||
        newUserData.name?.split(" ")[0] ||
        newUserData.name,
      lastName: newUserData.lastName || newUserData.name?.split(" ")[1] || "",
      email: newUserData.email,
      role: newUserData.role,
    };

    authStorage.setUser(backendUser);
    console.log("AuthContext: Setting new user:", backendUser);

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: backendUser },
    });
  };

  const isMentor = () => {
    return state.user?.role === USER_ROLES.MENTOR;
  };

  const isStudent = () => {
    return state.user?.role === USER_ROLES.STUDENT;
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Helper to get user display name
  const getUserDisplayName = () => {
    if (!state.user) return "";
    if (state.user.firstName && state.user.lastName) {
      return `${state.user.firstName} ${state.user.lastName}`;
    }
    return state.user.name || state.user.email || "User";
  };

  useEffect(() => {
    const handleAuthExpired = (event) => {
      console.log("Auth expired event received:", event.detail);
      forceLogout();
    };

    const handleCustomStorageChange = (event) => {
      if (event.detail === "auth-update") {
        checkAuth();
      }
    };

    // Initial auth check
    checkAuth();

    // Listen for auth expiration events from API interceptor
    window.addEventListener("auth-expired", handleAuthExpired);
    window.addEventListener("auth-storage-change", handleCustomStorageChange);

    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
      window.removeEventListener(
        "auth-storage-change",
        handleCustomStorageChange,
      );
    };
  }, []);

  const value = {
    ...state,

    login,
    register,
    logout,
    forceLogout,
    checkAuth,
    updateUser,
    clearError,
    getUserDisplayName,

    isMentor,
    isStudent,
  };

  // Debugging helpers for development
  useEffect(() => {
    window.switchToMentor = () => {
      const newUser = {
        id: 2,
        firstName: "Test",
        lastName: "Mentor",
        email: "mentor@test.com",
        role: "mentor",
      };
      updateUser(newUser);
    };

    window.switchToStudent = () => {
      const newUser = {
        id: 1,
        firstName: "Test",
        lastName: "Student",
        email: "student@test.com",
        role: "student",
      };
      updateUser(newUser);
    };

    window.clearAuth = () => {
      forceLogout();
    };

    window.checkAuthStatus = () => {
      console.log("Current auth state:", state);
      checkAuth();
    };

    return () => {
      delete window.switchToMentor;
      delete window.switchToStudent;
      delete window.clearAuth;
      delete window.checkAuthStatus;
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
