import { useState, useEffect } from "react";
import { User } from "@/types";
import { auth } from "@/config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || undefined,
          isGuest: false,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Check if email is verified
      if (!firebaseUser.emailVerified) {
        await signOut(auth); // Sign out the user immediately
        return {
          success: false,
          error: "Email not verified. Please verify your email before logging in.",
          needsVerification: true,
          email: firebaseUser.email
        };
      }
      
      const userData: User = {
        id: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || undefined,
        isGuest: false,
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (error: any) {
      setLoading(false);
      let errorMessage = "An error occurred during login";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Email or password is incorrect";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the display name
      await updateProfile(firebaseUser, { displayName: username });
      
      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      // Don't set the user in state - they need to verify their email first
      return { success: true, email: firebaseUser.email };
    } catch (error: any) {
      setLoading(false);
      let errorMessage = "An error occurred during registration";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "User already exists. Please sign in";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const loginAsGuest = () => {
    const guest: User = {
      id: "guest_" + Math.random().toString(36).slice(2),
      username: "Alien Guest",
      isGuest: true,
    };
    setUser(guest);
    return guest;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if Firebase sign out fails, we should clear the local user state
      setUser(null);
    }
  };

  return { user, login, register, loginAsGuest, logout, loading };
}
