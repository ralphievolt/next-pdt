'use client';

import { useRouter } from 'next/navigation';
import {
  IconBell,
  IconCircleHalf2,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconMessageCircle,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
  IconUser,
  IconUserEdit,
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import {
  ActionIcon,
  Avatar,
  Burger,
  Flex,
  Group,
  Indicator,
  MantineTheme,
  Menu,
  rem,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { upperFirst, useMediaQuery } from '@mantine/hooks';

const ICON_SIZE = 20;

type HeaderNavProps = {
  mobileOpened?: boolean;
  toggleMobile?: () => void;
  desktopOpened?: boolean;
  toggleDesktop?: () => void;
};

const HeaderNav = (props: HeaderNavProps) => {
  const { desktopOpened, toggleDesktop, toggleMobile, mobileOpened } = props;
  const theme = useMantineTheme();
  const laptop_match = useMediaQuery('(max-width: 992px)');
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const { data: session, status } = useSession();
  const router = useRouter();
 
  return (
    <Group justify="space-between">
      <Group gap={0}>
        <ActionIcon visibleFrom="md" onClick={toggleDesktop}>
          {desktopOpened ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
        </ActionIcon>
        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="md" size="sm" />
        {!mobile_match && (
          <TextInput
            placeholder="search"
            rightSection={<IconSearch size={ICON_SIZE} />}
            ml="md"
            style={{ width: tablet_match ? 'auto' : rem(400) }}
          />
        )}
      </Group>
      <Group>
        {mobile_match && (
          <ActionIcon>
            <IconSearch size={ICON_SIZE} />
          </ActionIcon>
        )}
        <Text c="violet">{session?.user?.name}</Text>
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <ActionIcon>
              <IconUser size={ICON_SIZE} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              Select actions
            </Menu.Label>
            <Menu.Item
              leftSection={<IconUserEdit size={16} />}
              onClick={() => router.push('/authentication/change-password')}
            >
              Change Password
            </Menu.Item>
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              onClick={() => {
                signOut({ redirect: false }).then(() => {
                  router.push('/authentication/signin');
                });
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;
