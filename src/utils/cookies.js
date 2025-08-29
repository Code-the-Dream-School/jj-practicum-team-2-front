export const authStorage = {
  // Save user to localStorage (for development only)
  setUser: (user) => {
    try {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user:", error);
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem("auth_user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error loading user:", error);
      return null;
    }
  },

  clearAuth: () => {
    localStorage.removeItem("auth_user");
  },
};

export const authCookies = authStorage;
