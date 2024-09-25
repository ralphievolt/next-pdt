'use client';

import React from 'react';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Button, Grid, Group, PaperProps, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function NewModal() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      status: 'Ready for Staging',
      part: '',
      issue: '',
      details: '',
      action: '',
      responsible: '',
      assortment: '',
      shelf: '', // Added shelf
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }} >
            <TextInput label="Shelf" placeholder="shelf" {...form.getInputProps('shelf')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg:6 }} >
            <Select
              label="Status"
              placeholder="status"
              data={['Approved', 'Rejected', 'Stage', 'Ready for Staging']}
              {...form.getInputProps('status')}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg:6 }} >
            <TextInput label="Part" placeholder="part name" {...form.getInputProps('part')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg:6 }} >
            <TextInput label="Issue" placeholder="issue" {...form.getInputProps('issue')} />
          </Grid.Col>
        </Grid>
        <Textarea
          label="Details"
          placeholder="details"
          autosize
          {...form.getInputProps('details')}
        />
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg:6 }} >
            <TextInput label="Action" placeholder="action" {...form.getInputProps('action')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg:6 }} >
            <TextInput
              label="Responsible"
              placeholder="responsible"
              {...form.getInputProps('responsible')}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg:6 }}>
            <TextInput
              label="Assortment"
              placeholder="assortment"
              {...form.getInputProps('assortment')}
            />
          </Grid.Col>
        </Grid>
        <Grid justify="center" mt="lg" mb="lg">
          <Button leftSection={<IconDeviceFloppy size={16} />} type="submit">
            Add Result
          </Button>
        </Grid>
      </Stack>
    </form>
    </>
  );
}

export default NewModal;
