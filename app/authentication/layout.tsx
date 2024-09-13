'use client';

import React, { ReactNode } from 'react';
import { Center, Stack } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import '@mantine/notifications/styles.css';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return (
    <Center
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <Stack>
        <Notifications position="bottom-right" zIndex={1000} />
        {children}
      </Stack>
    </Center>
  );
}

export default AuthLayout;
