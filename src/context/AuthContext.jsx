import { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import { USER_ROLES } from "../utils/constants";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

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

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authAPI.login(credentials);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

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

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authAPI.register(userData);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

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

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const forceLogout = () => {
    localStorage.clear();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const refreshAuth = () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log("AuthContext: Обновляем пользователя на:", userData);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: userData, token },
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } else {
      console.log("AuthContext: Очищаем пользователя");
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateUser = (newUserData) => {
    localStorage.setItem("user", JSON.stringify(newUserData));
    localStorage.setItem("token", "mock-token");
    console.log("AuthContext: Устанавливаем нового пользователя:", newUserData);
    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: newUserData, token: "mock-token" },
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: userData, token },
            });
          } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        } else {
          // Mock fallback user for testing
          const mockUser = {
            id: 1,
            name: "Test Student",
            email: "student@test.com",
            role: "student",
          };

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: mockUser, token: "mock-token" },
          });
        }
      } catch {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    const handleStorageChange = () => {
      checkAuth();
    };

    const handleCustomStorageChange = (event) => {
      if (event.detail === "auth-update") {
        checkAuth();
      }
    };

    checkAuth();

    // listen for localStorage changes
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-storage-change", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
    refreshAuth,
    updateUser,
    clearError,

    isMentor,
    isStudent,
  };

  // Debugging helpers
  useEffect(() => {
    window.switchToMentor = () => {
      const newUser = {
        id: 2,
        name: "Test Mentor",
        email: "mentor@test.com",
        role: "mentor",
      };
      updateUser(newUser);
    };

    window.switchToStudent = () => {
      const newUser = {
        id: 1,
        name: "Test Student",
        email: "student@test.com",
        role: "student",
      };
      updateUser(newUser);
    };

    window.clearAuth = () => {
      forceLogout();
    };

    return () => {
      delete window.switchToMentor;
      delete window.switchToStudent;
      delete window.clearAuth;
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
