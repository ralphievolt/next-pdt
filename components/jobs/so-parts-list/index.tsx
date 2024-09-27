'use client';

import dayjs from 'dayjs';
import React from 'react';
import { Paper } from '@mantine/core';
import SignOffPageHeader from '@/components/jobs/PageHeader/SignOff-PageHeader';
import SignOffTable from '@/components/Table/SignOffTable';

export default function ResultForm(props: any) {
  const [completion, setCompletion] = React.useState(0);

  React.useEffect(() => {
    const results = props.job[0].results;
    const approved = results.filter((val: any) => val.status === 'Approved');
    const totalParts = results.filter((val: any) => val.status !== 'Cancelled');
    const arrMembers = [
      {
        value: props.job[0].project_manager[0],
        label: props.job[0].project_manager[0],
      },
      {
        value: props.job[0].engineer[0],
        label: props.job[0].engineer[0],
      },
      {
        value: props.job[0].maker[0],
        label: props.job[0].maker[0],
      },
      {
        value: props.job[0].qct[0],
        label: props.job[0].qct[0],
      },
      {
        value: props.job[0].coordinator[0],
        label: props.job[0].coordinator[0],
      },

      {
        value: props.job[0].inspector[0],
        label: props.job[0].inspector[0],
      },
    ];

    const cleanMembers = arrMembers.filter((obj) => obj.value !== null);

    setCompletion(Math.round((approved.length / totalParts.length) * 100));

    results.map(({ shelf, part, status, issue, detail, action, responsible, entry_by }: any) => {
    });
  }, []);

  return (
    <Paper withBorder radius="md" p="md">
      <SignOffPageHeader
        title={`${props.job[0].job_number} ${props.job[0].brand} ${completion}%`}
      />
      <SignOffTable results={props.job[0].results} />
    </Paper>
  );
}
