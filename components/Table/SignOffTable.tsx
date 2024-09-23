'use client';

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Tag, Text, useDisclosure } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { Box, Stack } from '@mantine/core';

import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css';

import { resultAtom } from '@/stores/';

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

const SignOffTable = (props: any) => {
  const [tableData, setTableData] = useState<Job[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [result, setResult] = useAtom(resultAtom);

  const params = useParams();

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
              <Tag size={'md'} variant="solid" bg="green.400">
                {cell.getValue<string>()}
              </Tag>
            );
          if (cell.row.original.status === 'Rejected')
            return (
              <Tag size={'md'} variant="solid" bg="red.400">
                {cell.getValue<string>()}
              </Tag>
            );
          if (cell.row.original.status === 'Staged')
            return (
              <Tag size={'md'} variant="solid" bg="cyan.200" color="black">
                {cell.getValue<string>()}
              </Tag>
            );

          return cell.getValue<string>();
        }
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
              <Tag size={'md'} variant="solid" bg="green.400">
                {cell.getValue<string>()}
              </Tag>
            );
          if (cell.row.original.issue_status === 'Open')
            return (
              <Tag size={'md'} variant="solid" bg="red.400">
                {cell.getValue<string>()}
              </Tag>
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

  useEffect(() => {
    let newArray = props.results.filter((el: any) => el.status !== 'Cancelled');
    setTableData(newArray);
  }, [props.results]);

  return (
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
        // grouping: ["groupId"],// see type Job
      }}
      enableColumnOrdering
      enableTopToolbar={false}
      mantineTableProps={{
        striped: true,
      }}
      mantineTableBodyRowProps={({ row }) => ({
        onClick: (event) => {
          setResult(row.original);
          onOpen();
        },
      })}
      mantinePaperProps={{ shadow: '0', withBorder: false }}
    />
  );
};

export default SignOffTable;
