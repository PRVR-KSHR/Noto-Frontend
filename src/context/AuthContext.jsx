import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence  // ✅ CHANGED: Use LOCAL persistence
} from "firebase/auth";
import { authAPI } from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // ✅ FIXED: Use Session persistence (stays logged in after refresh/browser restart)
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log('✅ Firebase auth persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('❌ Failed to set auth persistence:', error);
      });

    // ✅ REMOVED: No more beforeunload event listener
    // This was causing logout on page refresh
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🔄 Auth state changed:", firebaseUser?.email || "No user");
      
      if (firebaseUser) {
        // Only try to get profile if we don't already have it
        if (!userProfile) {
          try {
            // Wait a bit to ensure user is created in database
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const profileResponse = await authAPI.getProfile();
            setUser(firebaseUser);
            setUserProfile(profileResponse.data.user);
            console.log("✅ User profile loaded from auth state change");
          } catch (error) {
            console.log("ℹ️ Profile not yet available, will be set after login");
            // Still set Firebase user, profile will be set after successful login
            setUser(firebaseUser);
            setUserProfile(null);
          }
        } else {
          // We already have profile, just update Firebase user
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [userProfile]);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      console.log("🔄 Starting Google login...");

      // ✅ FIXED: Set local persistence before sign-in
      await setPersistence(auth, browserSessionPersistence);
      console.log("✅ Session persistence set before login");

      // Firebase Google sign in
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Firebase login successful:", result.user.email);

      // Get Firebase ID token
      const idToken = await result.user.getIdToken(true);
      console.log("✅ Got Firebase ID token");

      // Send token to backend - This creates the user in DB
      const response = await authAPI.googleLogin(idToken);
      console.log("✅ Backend login successful:", response);

      // Set both user and profile after successful backend creation
      setUser(result.user);
      setUserProfile(response.data.user);

      // Personalized welcome messages
      const userName = response.data.user.displayName;
      if (response.data.isNewUser) {
        toast.success(`Welcome to NOTO, ${userName}! 🎉 Your account has been created successfully!`);
      } else {
        toast.success(`Welcome back, ${userName}! 👋`);
      }

      return result.user;
    } catch (error) {
      console.error("❌ Login error:", error);
      let errorMessage = "Login failed";
      
      if (error.code === "ERR_NETWORK") {
        errorMessage = "Connection failed - Please check if backend server is running";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("🔄 Logging out...");
      
      // Call backend logout (optional)
      try {
        await authAPI.logout();
      } catch (error) {
        console.warn("⚠️ Backend logout failed, continuing with Firebase logout:", error);
      }

      // Firebase logout
      await signOut(auth);
      setUserProfile(null);
      console.log("✅ Logout successful");
      // Redirect user to home page from any route (Profile, Admin, etc.)
      // Use replace to avoid navigating back to the protected page.
      try {
        // Show a quick toast if the page isn't about to change immediately
        toast.success("Logged out successfully!");
      } catch {}
      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast.error("Logout failed: " + error.message);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUserProfile(response.data.user);
      toast.success("Profile updated successfully!");
      return response.data.user;
    } catch (error) {
      console.error("❌ Profile update error:", error);
      toast.error("Profile update failed: " + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loginWithGoogle,
    logout,
    updateUserProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
