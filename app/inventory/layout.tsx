'use client';

import { ReactNode, useState } from 'react';
import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import AppMain from '@/components/AppMain';
import FooterNav from '@/components/FooterNav';
import HeaderNav from '@/components/HeaderNav';
import Navigation from '@/components/Navigation';
import { ProvidersAuth } from '@/providers/session';

import '@mantine/notifications/styles.css';

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <ProvidersAuth>
      <AppShell
        layout="alt"
        header={{ height: 60 }}
        footer={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'md',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding={0}
      >
        <AppShell.Header
          style={{
            height: rem(60),
            border: 'none',
            boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
          }}
        >
          <Container fluid py="sm" px="lg">
            <HeaderNav
              desktopOpened={desktopOpened}
              mobileOpened={mobileOpened}
              toggleDesktop={toggleDesktop}
              toggleMobile={toggleMobile}
            />
          </Container>
        </AppShell.Header>
        <AppShell.Navbar>
          <Navigation onClose={toggleMobile} />
        </AppShell.Navbar>
        <AppShell.Main>
          <AppMain>
            <Notifications position="bottom-right" zIndex={1000} />
            {children}
          </AppMain>
        </AppShell.Main>
        <AppShell.Footer p="md">
          <Container fluid px="lg">
            <FooterNav />
          </Container>
        </AppShell.Footer>
      </AppShell>
    </ProvidersAuth>
  );
}

export default DashboardLayout;
