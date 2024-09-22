'use client';

import Link from 'next/link';
import { IconChevronRight } from '@tabler/icons-react';
import { Button, Container, Grid, Group, Paper, PaperProps, Stack, Text } from '@mantine/core';
import { PageHeader } from '@/components';
import { useFetchData } from '@/hooks';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function Page() {
  const {
    data: projectsData,
    error: projectsError,
    loading: projectsLoading,
  } = useFetchData('/mocks/Projects.json');
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useFetchData('/mocks/StatsGrid.json');

  return (
    <>
      <>
        <title>PDT | Dashboard</title>
        <meta name="description" content="fastest and easiest way to track parts in your company" />
        
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Job List" withActions={true} />
        </Stack>
      </Container>
    </>
  );
}

export default Page;
