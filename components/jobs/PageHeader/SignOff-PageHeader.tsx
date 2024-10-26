import React from 'react';
import { useParams } from 'next/navigation';
import { IconEdit, IconHexagonLetterR, IconPencilPlus } from '@tabler/icons-react';
import { useAtom, useAtomValue } from 'jotai';
import { useSession } from 'next-auth/react';
import {
  ActionIcon,
  Divider,
  Menu,
  Modal,
  NumberInput,
  Paper,
  PaperProps,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Surface } from '@/components';
import NewResult from '@/components/jobs/so-parts-list/new-result';
import NegativeNotification from '@/components/Notifications/negative-notification';
import PositiveNotification from '@/components/Notifications/positive-notification';
import { statesAtom } from '@/stores';
import { soPartsAtom } from '@/stores/prop-state';

type PageHeaderProps = {
  title: string;
} & PaperProps;

interface MenuItem {
  label: string;
  value: string;
}

const SignOffPageHeader = (props: PageHeaderProps) => {
  const { title, ...rest } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { data: session, status } = useSession();
  const [soparts, setSoParts] = useAtom(soPartsAtom);

  const params = useParams();
  const slug = params.id;

  const states = useAtomValue(statesAtom);
  const menuItems: MenuItem[] = states;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.getAttribute('data-value');

    if (session?.user?.role === 'viewer') {
      NegativeNotification('Access denied');
      return;
    }
    try {
      const res = await fetch(`${slug}/api/update-status`, {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      PositiveNotification('Status updated successfully! ');
    } catch (error) {
      NegativeNotification(error instanceof Error ? error.message : 'Update failed!');
    }
  };

  return (
    <>
      <Surface
        component={Paper}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
        }}
        {...rest}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title order={3}>{title}</Title>
          <Menu>
            <Menu.Target>
              <IconEdit
                size={24}
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                color="var(--mantine-color-violet-filled)"
              />
            </Menu.Target>

            <Menu.Dropdown>
              {menuItems.map((item) => (
                <Menu.Item key={item.value} data-value={item.value} onClick={handleClick}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <NumberInput
            allowNegative={false}
            hideControls
            maxLength={2}
            style={{ width: '80px' }}
            rightSection={<IconHexagonLetterR />}
          />
          <ActionIcon size="lg" style={{ marginLeft: '10px' }} onClick={open}>
            <IconPencilPlus size={24} />
          </ActionIcon>
        </div>
      </Surface>
      <Divider />

      <Modal opened={opened} onClose={close} title="Add Result" size="xl" yOffset="1.5vh">
        <NewResult />
      </Modal>

      {/* <Modal opened={opened} onClose={close} title="Update Result" size="xl" yOffset="1.5vh">
        <UpdateResult /> 
      </Modal> */}
    </>
  );
};

export default SignOffPageHeader;
