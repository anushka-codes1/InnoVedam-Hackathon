'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  collegeName: string;
  memberSince?: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('campusSwapUserData');
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && userData) {
      localStorage.setItem('campusSwapUserData', JSON.stringify(userData));
    }
  }, [userData, isInitialized]);

  const updateUserData = (data: UserData | null) => {
    setUserData(data);
    if (data === null) {
      localStorage.removeItem('campusSwapUserData');
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData: updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
