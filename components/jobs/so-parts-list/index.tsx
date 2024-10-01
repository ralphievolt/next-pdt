'use client';

import React from 'react';
import { useSetAtom } from 'jotai';
import { Paper } from '@mantine/core';
import SignOffPageHeader from '@/components/jobs/PageHeader/SignOff-PageHeader';
import SignOffTable from '@/components/Table/SignOffTable';
import { soPartsAtom } from '@/stores/prop-state';

export default function ResultForm(props: any) {
  const [completion, setCompletion] = React.useState(0);
  const setSoParts = useSetAtom(soPartsAtom)
  const results = props.job[0].results;

  React.useEffect(() => {
    const approved = results.filter((val: any) => val.status === 'Approved');
    const totalParts = results.filter((val: any) => val.status !== 'Cancelled');
    setCompletion(Math.round((approved.length / totalParts.length) * 100));
    setSoParts(results);
  }, [props.job]);

  return (
    <Paper withBorder radius="md" p="md">
      <SignOffPageHeader
        title={`${props.job[0].job_number} ${props.job[0].brand} ${completion}%`}
      />
      <SignOffTable />
    </Paper>
  );
}
