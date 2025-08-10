import React from 'react';
import { ReactNode } from 'react';

interface AdminWrapperProps {
  children: ReactNode;
}

const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default AdminWrapper;
