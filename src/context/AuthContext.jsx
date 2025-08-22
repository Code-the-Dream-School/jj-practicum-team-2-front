import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import { USER_ROLES } from "../utils/constants";

// Auth state structure
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authAPI.login(credentials);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response,
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

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authAPI.register(userData);

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: response,
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

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Check if user is mentor
  const isMentor = () => {
    return state.user?.role === USER_ROLES.MENTOR;
  };

  // Check if user is student
  const isStudent = () => {
    return state.user?.role === USER_ROLES.STUDENT;
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Add endpoint to check current user
        // For now, just set loading to false
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      } catch {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  const value = {
    // State
    ...state,

    // Actions
    login,
    register,
    logout,
    clearError,

    // Helper functions
    isMentor,
    isStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
