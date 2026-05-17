import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import type { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && db) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          setProfile({
            email: firebaseUser.email ?? '',
            fullName: firebaseUser.displayName ?? '',
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase non configuré');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    if (!auth || !db) throw new Error('Firebase non configuré');
    const fullName = `${firstName} ${lastName}`.trim();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: fullName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      fullName,
      createdAt: new Date().toISOString(),
    });
    return cred;
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase non configuré');
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (db && cred.user) {
      await setDoc(
        doc(db, 'users', cred.user.uid),
        {
          email: cred.user.email,
          fullName: cred.user.displayName,
        },
        { merge: true }
      );
    }
    return cred;
  };

  const signOutUser = async () => {
    if (!auth) return;
    await signOut(auth);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase non configuré');
    return sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (newPassword: string) => {
    if (!user) throw new Error('Non connecté');
    return updatePassword(user, newPassword);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !db) return;
    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    setProfile((p) => ({ ...p!, ...data }));
  };

  return {
    user,
    profile,
    loading,
    isConfigured: isFirebaseConfigured,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: signOutUser,
    resetPassword,
    changePassword,
    updateProfile: updateUserProfile,
  };
}
