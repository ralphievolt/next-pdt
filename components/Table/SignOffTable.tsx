'use client';

import dayjs from 'dayjs';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { Tag } from '@chakra-ui/react';
import { useAtom, useAtomValue,useSetAtom } from 'jotai';
import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import {
  ActionIcon,
  Box,
  Divider,
  Menu,
  Modal,
  NumberInput,
  Paper,
  PaperProps,
  Pill,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css';

import { getSoPartDetails } from '@/app/jobs/signoff-parts/[id]/fetcher/soparts-details';
import UpdateResult from '@/components/jobs/so-parts-list/update-result';
import { rowValueAtom } from '@/stores/';
import { soPartsAtom } from '@/stores/prop-state';

export type Job = {
  shelf: string;
  part: string;
  round: number;
  date_started: Date;
  status: string;
  issue: string;
  detail: string;
  issue_status: string;
  action: string;
  responsible: string;
  entry_date: Date;
  assort: string;
};

const SignOffTable = () => {
  const setResult = useSetAtom(rowValueAtom)
  const tableData = useAtomValue(soPartsAtom);
  const [opened, { open, close }] = useDisclosure(false);

  const columns = useMemo<MRT_ColumnDef<Job>[]>(
    () => [
      {
        accessorKey: 'shelf',
        header: 'Shelf',
        size: 50,
        enableColumnOrdering: false,
      },
      {
        accessorKey: 'part',
        header: 'Part',
        size: 80,

        Cell: ({ cell }) => (
          <Text style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: 'round',
        header: 'Round',
        size: 50,
      },
      {
        accessorFn: (row) => {
          let sDate = new Date(row.date_started);
          sDate.setHours(0, 0, 0, 0); // remove time from date or can't filter
          return sDate;
        },
        id: 'date_started',
        header: 'SO Started',
        size: 50,
        Cell: ({ cell }) =>
          dayjs(cell.getValue<Date>()).isValid() ? (
            dayjs(cell.getValue<Date>()).format('YYYY-MM-DD')
          ) : (
            <>{'---'}</>
          ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 50,
        Cell: ({ cell }) => {
          if (cell.row.original.status === 'Approved')
            return (
              <Box bg={'green'} c="#fff" ta="center" style={{ borderRadius: '5px' }}>
                {cell.getValue<string>()}
              </Box>
            );
          if (cell.row.original.status === 'Rejected')
            return (
              <Box bg={'red'} c="#fff" ta="center" style={{ borderRadius: '5px' }}>
                {cell.getValue<string>()}
              </Box>
            );
          if (cell.row.original.status === 'Staged')
            return (
              <Box bg={'cyan'} c="#fff" ta="center" style={{ borderRadius: '5px' }}>
                {cell.getValue<string>()}
              </Box>
            );

          return cell.getValue<string>();
        },
      },

      {
        accessorKey: 'issue',
        header: 'Issue',
        size: 50,
      },
      {
        accessorKey: 'detail',
        header: 'Details',
        size: 250,
        Cell: ({ cell }) => (
          <Text style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: 'issue_status',
        header: 'Issue Status',
        size: 50,
        Cell: ({ cell }) => {
          if (cell.row.original.issue_status === 'Closed')
            return (
              <Box bg={'green'} c="#fff" ta="center" style={{ borderRadius: '5px' }} w="50%">
                {cell.getValue<string>()}
              </Box>
            );
          if (cell.row.original.issue_status === 'Open')
            return (
              <Box bg={'red'} c="#fff" ta="center" style={{ borderRadius: '5px' }} w="50%">
                {cell.getValue<string>()}
              </Box>
            );

          return cell.getValue<string>();
        },
      },
      {
        accessorKey: 'action',
        header: 'Action Needed',
        size: 50,
      },
      {
        accessorKey: 'responsible',
        header: 'Responsible',
        size: 50,
      },
      {
        accessorFn: (row) => {
          let sDate = new Date(row.entry_date);
          sDate.setHours(0, 0, 0, 0); // remove time from date or can't filter
          return sDate;
        },
        id: 'entry_date',
        header: 'Entry Date',
        size: 50,
        Cell: ({ cell }) => dayjs(cell.getValue<Date>()).format('YYYY-MM-DD'),
      },
      {
        accessorKey: 'assort',
        header: 'Assort',
        size: 50,
      },
    ],
    []
  );

  return (
    <>
      <MantineReactTable
        columns={columns}
        data={tableData}
        enableGrouping
        enableColumnDragging={false}
        initialState={{
          density: 'xs',
          pagination: { pageSize: 30, pageIndex: 0 },
          columnVisibility: {
            round: false,
          },
          sorting: [
            {
              id: 'shelf', //sort by age by default on page load
              desc: false,
            },
          ],
        }}
        enableColumnOrdering
        enableTopToolbar={false}
        mantineTableProps={{
          striped: true,
        }}
        mantineTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            setResult(row.original);
            open();
          },
        })}
        mantinePaperProps={{ shadow: '0', withBorder: false }}
      />
      <Modal opened={opened} onClose={close} title="Add Result" size="xl" yOffset="1.5vh">
        <UpdateResult />
      </Modal>
    </>
  );
};

export default SignOffTable;
