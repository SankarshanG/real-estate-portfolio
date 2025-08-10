import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface AdminWrapperProps {
  children: ReactNode;
}

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default AdminWrapper;
