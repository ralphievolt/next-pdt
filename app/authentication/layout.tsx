'use client';

import React, { ReactNode } from 'react';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return (
    <>
      <Notifications position="bottom-right" zIndex={1000} />
      {children}
    </>
  );
}

export default AuthLayout;
