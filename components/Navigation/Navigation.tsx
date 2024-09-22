import {
  IconChartBar,
  IconDirection,
  IconList,
  IconListDetails,
  IconLocationDown,
  IconLogin2,
  IconPencilDown,
  IconUserPlus,
  IconX,
  IconQrcode
} from '@tabler/icons-react';
import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Logo, UserProfileButton } from '@/components';
import { LinksGroup } from '@/components/Navigation/Links/Links';
import UserProfileData from '@/public/mocks/UserProfile.json';
import {
  PATH_AUTH,
  PATH_DASHBOARD,
  PATH_INVENTORY_ITEMS,
  PATH_INVENTORY_LOCATIONS,
  PATH_INVENTORY_QR
} from '@/routes';
import classes from './Navigation.module.css';

const mockdata = [
  {
    title: 'Model Shop',
    // links: [{ label: 'Model Shop Performance', icon: IconChartBar, link: PATH_DASHBOARD.default }],
    links: [{ label: 'Job List', icon: IconChartBar, link: PATH_DASHBOARD.root }],

  },
  {
    title: 'Inventory',
    links: [
      { label: 'Item List', icon: IconListDetails, link: PATH_INVENTORY_ITEMS.default },
      { label: 'Register Item', icon: IconPencilDown, link: PATH_INVENTORY_ITEMS.register },
      { label: 'Location List', icon: IconList, link: PATH_INVENTORY_LOCATIONS.default },
      {
        label: 'Register Location',
        icon: IconLocationDown,
        link: PATH_INVENTORY_LOCATIONS.register,
      },
      {
        label: 'Scan QR Code',
        icon: IconQrcode,
        link: PATH_INVENTORY_QR.default,
      },
    ],
  },
  {
    title: 'Auth',
    links: [
      { label: 'Sign In', icon: IconLogin2, link: PATH_AUTH.signin },
      { label: 'Sign Up', icon: IconUserPlus, link: PATH_AUTH.signup },
      // {
      //   label: 'Reset Password',
      //   icon: IconRotateRectangle,
      //   link: PATH_AUTH.passwordReset,
      // },
    ],
  },
];

type NavigationProps = {
  onClose: () => void;
};

const Navigation = ({ onClose }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = mockdata.map((m) => (
    <Box pl={0} mb="md" key={m.title}>
      <Text tt="uppercase" size="xs" pl="md" fw={500} mb="sm" className={classes.linkHeader}>
        {m.title}
      </Text>
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group justify="space-between" style={{ flex: tablet_match ? 'auto' : 1 }}>
            <Logo className={classes.logo} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserProfileButton
          email={'pdtsupport@arraymarketing.com'}
          image={UserProfileData.avatar}
          name={'Contact Tech Support'}
        />
      </div>
    </nav>
  );
};

export default Navigation;
