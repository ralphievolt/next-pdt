'use client';

import dayjs from 'dayjs';
import React from 'react';
import { Paper } from '@mantine/core';
import SignOffPageHeader from '@/components/PageHeader/SignOff-PageHeader';
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
      const rowDetails = {
        Created: dayjs().format('MM/DD/YYYY h:mm A'),
        'Requested By:': entry_by,
        Shift: 'Day Shift',
        'QA Inspector': 'Vanitha',
        'Inspection Area / Work Center': 'Model Shop',
        'Sub Process': 'Model shop Sign off',
        'Work Station': '',
        'Job Number': props.job[0].job_number,
        'Project Name / Customer': props.job[0].brand,
        'Part Number / Item': part,
        Description: shelf,
        Source: 'MASTER SIGN OFF',
        'Qality Status': status,
        'Inspected Qty': 1,
        'Released Quantity': status === 'Approved' ? 1 : 0,
        'Rejected Quantity': status === 'Approved' ? 0 : 1,
        'Defect Code': '',
        'Originated In Other Process': '',
        'Work Center Origin': '',
        Comments: `${detail} || ${action}`,
      };
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
