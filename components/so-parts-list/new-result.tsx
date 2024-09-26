'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { signOut, useSession } from 'next-auth/react';
import { Button, Grid, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import NegativeNotification from '@/components/Notifications/negative-notification';
import PositiveNotification from '@/components/Notifications/positive-notification';
import { actionFormAtom, issueFormAtom, partFormAtom, statusAtoms } from '@/stores';
import { itemsSelect } from './combox-items';

function NewResult() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      shelf: '',
      status: '',
      detail: '',
      responsible: '',
      assort: '',
    },
    validate: {
      shelf: isNotEmpty('Shelf cannot be empty'),
      status: isNotEmpty('Status cannot be empty'),
      assort: isNotEmpty('Assortment cannot be empty'),
      responsible: (value, values) => {
        if (issueSelected !== '') {
          return isNotEmpty('Responsible cannot be empty')(value);
        }
      },
    },
  });

  const { data: session, status } = useSession();
  const params = useParams();
  const slug = params.id;
  const partSelected = useAtomValue(partFormAtom);
  const actionSelected = useAtomValue(actionFormAtom);
  const issueSelected = useAtomValue(issueFormAtom);
  const statusSelection = useAtomValue(statusAtoms);
  const statusArr = statusSelection.map((item) => item.value);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: typeof form.values) => {
    if (partSelected === '' || partSelected === null) {
      NegativeNotification('Part name required!');
      return;
    }

    if (values.status === 'Rejected' && (issueSelected === '' || actionSelected === '')) {
      NegativeNotification('Issue and Action entry required. Please try again');
      return;
    }

    const result = {
      ...values,
      shelf: values.shelf.toUpperCase(),
      part: partSelected,
      issue: issueSelected,
      action: actionSelected,
    };

    if (session?.user?.role === 'viewer') {
      NegativeNotification('Access denied');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${slug}/api/new-result`, {
        method: 'POST',
        body: JSON.stringify(result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to add new result');
        setLoading(false);
      }

      PositiveNotification('New result added successfully! ');
      setLoading(false);
    } catch (error) {
      NegativeNotification(error instanceof Error ? error.message : 'Add result failed!');
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Grid>
            <Grid.Col span={{ base: 6, md: 6 }}>
              <TextInput label="Shelf" placeholder="shelf" {...form.getInputProps('shelf')} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6 }}>
              <Select
                label="Status"
                placeholder="select status"
                data={statusArr}
                {...form.getInputProps('status')}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 5, md: 5 }}>{itemsSelect('part')}</Grid.Col>
            <Grid.Col span={{ base: 7, md: 7 }}>{itemsSelect('issue')}</Grid.Col>
          </Grid>
          <Textarea
            label="Detail"
            placeholder="detail"
            autosize
            {...form.getInputProps('detail')}
          />
          <Grid>
            <Grid.Col span={{ base: 7, md: 6 }}>{itemsSelect('action')}</Grid.Col>
            <Grid.Col span={{ base: 5, md: 6 }}>
              <TextInput
                label="Responsible"
                placeholder="responsible"
                {...form.getInputProps('responsible')}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 7, md: 6 }}>
              <TextInput label="Assort" placeholder="assort" {...form.getInputProps('assort')} />
            </Grid.Col>
          </Grid>
          <Grid justify="center" mt="lg" mb="lg">
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              type="submit"
              loading={loading}
              loaderProps={{ type: 'bars' }}
            >
              Add Result
            </Button>
          </Grid>
        </Stack>
      </form>
    </>
  );
}

export default NewResult;
