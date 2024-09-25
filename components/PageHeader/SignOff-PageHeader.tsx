import React from 'react';
import { useParams } from 'next/navigation';
import { IconEdit } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { Button, Divider, Menu, Modal, Paper, PaperProps, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Surface } from '@/components';
import NegativeNotification from '@/components/Notifications/negative-notification';
import PositiveNotification from '@/components/Notifications/positive-notification';
import NewModal from '@/components/so-parts-list/new-modal';
import NewResult from '@/components/so-parts-list/new-result';

type PageHeaderProps = {
  title: string;
} & PaperProps;

interface MenuItem {
  label: string;
  value: string;
}

const menuItems: MenuItem[] = [
  { label: 'Ready for Staging', value: 'Ready for Staging' },
  { label: 'Staged', value: 'Staged' },
  { label: 'Awaiting SS', value: 'Awaiting SS' },
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'In-progress', value: 'In-progress' },
  { label: 'Signed-off', value: 'Signed-off' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Production Recall', value: 'Production Recall' },
];

const SignOffPageHeader = (props: PageHeaderProps) => {
  const { title, ...rest } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { data: session, status } = useSession();
  const params = useParams();
  const slug = params.id;

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
        <Button size="xs" style={{ marginLeft: 'auto' }} onClick={open}>
          Add Result
        </Button>
      </Surface>
      <Divider />

      <Modal opened={opened} onClose={close} title="Add Result" size="xl">
        <NewModal />
      </Modal>
    </>
  );
};

export default SignOffPageHeader;
