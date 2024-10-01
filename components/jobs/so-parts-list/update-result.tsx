'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { Button, Grid, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import NegativeNotification from '@/components/Notifications/negative-notification';
import PositiveNotification from '@/components/Notifications/positive-notification';
import { actionFormAtom, issueFormAtom, partFormAtom, statusAtoms } from '@/stores';
import { rowValueAtom } from '@/stores/';
import { SelectAction } from './select-action';
import { SelectPart } from './select-part';
import {SelectIssue} from "./select-issue"

interface RowValue {
  action: string;
  assort: string;
  detail: string;
  issue: string;
  issue_status: string;
  issue_status_opened: string | null;
  key: string;
  part: string;
  responsible: string;
  round: string;
  shelf: string;
  status: string;
}

function UpdateResult() {
  const rowPart = useAtomValue(rowValueAtom) as RowValue;
  const { data: session, status } = useSession();
  const params = useParams();
  const slug = params.id;
  const partSelected = useAtomValue(partFormAtom);
  const actionSelected = useAtomValue(actionFormAtom);
  const issueSelected = useAtomValue(issueFormAtom);
  const statusSelection = useAtomValue(statusAtoms);
  const statusArr = statusSelection.map((item) => item.value);
  const [loadingState, setLoading] = React.useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      shelf: rowPart.shelf,
      part:rowPart.part,
      status: rowPart.status,
      detail: rowPart.detail,
      responsible: rowPart.responsible,
      assort: rowPart.assort,
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

  const handleSubmit = async (values: typeof form.values) => {

    console.log(rowPart)

    // if (partSelected === '' || partSelected === null) {
    //   NegativeNotification('Part name required!');
    //   return;
    // }
    // if (values.status === 'Rejected' && (issueSelected === '' || actionSelected === '')) {
    //   NegativeNotification('Issue and Action entry required. Please try again');
    //   return;
    // }
    const result = {
      ...values,
      shelf: values.shelf.toUpperCase(),
      part: partSelected,
      issue: issueSelected,
      action: actionSelected,
    };
    // if (session?.user?.role === 'viewer') {
    //   NegativeNotification('Access denied');
    //   return;
    // }

    console.log({result})
    // try {
    //   setLoading(true);
    //   const res = await fetch(`${slug}/api/new-result`, {
    //     method: 'POST',
    //     body: JSON.stringify(result),
    //     headers: {
    //       Accept: 'application/json, text/plain, */*',
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (!res.ok) {
    //     throw new Error('Failed to add new result');
    //     setLoading(false);
    //   }
    //   PositiveNotification('New result added successfully! ');
    //   setLoading(false);
    // } catch (error) {
    //   NegativeNotification(error instanceof Error ? error.message : 'Add result failed!');
    //   setLoading(false);
    // }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Grid>
            <Grid.Col span={{ base: 6, md: 6 }}>
              <TextInput label="Shelf" placeholder="shelf" {...form.getInputProps('shelf')} />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6 }}>{SelectPart(rowPart.part)}</Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 6, md: 6 }}>
              <Select
                label="Shelf Status"
                placeholder="select status"
                data={statusArr}
                {...form.getInputProps('status')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 6 }}>
              <TextInput
                label="Responsible"
                placeholder="responsible"
                {...form.getInputProps('responsible')}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>{SelectIssue(rowPart.issue)}</Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>{SelectAction(rowPart.action)}</Grid.Col>
          </Grid>
          <Textarea
            label="Detail"
            placeholder="detail"
            autosize
            {...form.getInputProps('detail')}
          />
          <Grid>
            <Grid.Col span={{ base: 6, md: 6 }}>
              <TextInput label="Assort" placeholder="assort" {...form.getInputProps('assort')} />
            </Grid.Col>
          </Grid>
          <Grid justify="center" mt="lg" mb="lg">
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              type="submit"
              loading={loadingState}
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

export default UpdateResult;
