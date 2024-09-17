'use client';

import dayjs from 'dayjs';
import React from 'react';
import { MantineReactTable, MRT_TableOptions, type MRT_ColumnDef } from 'mantine-react-table';
import { ObjectId } from 'mongodb';
import { Paper } from '@mantine/core';
import { updateLocation } from '@/app/inventory/locations/actions/update-location';
import { PageHeader } from '@/components';
import NegativeNotification from '../Notifications/negative-notification';
import PositiveNotification from '../Notifications/positive-notification';

import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css';

// Define the structure of an individual item
interface Item {
  _id: ObjectId;
  locationId: string;
  locationName: string;
  quantity: number;
  status: string;
  createdAt: Date;
}

const LocationsTable: React.FC<{ items: Item[] }> = ({ items }) => {
  const [tableData, setTableData] = React.useState<Item[]>(() => items);

  const columns = React.useMemo<MRT_ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: 'locationId',
        header: 'Location Id',
        size: 75,
      },
      {
        accessorKey: 'locationName',
        header: 'Name',
      },

      {
        accessorKey: 'quantity',
        header: 'Qty',
        size: 30,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: ['Active', 'Deactivated'],
        },
        size: 30,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        enableEditing: false,
        Cell: ({ cell }) => dayjs(cell.getValue<Date>()).format('YYYY-MM-DD'),
        size: 50,
      },
    ],
    []
  );

  const handleSaveRow: MRT_TableOptions<Item>['onEditingRowSave'] = async ({
    exitEditingMode,
    row,
    values,
  }) => {
    try {
      await updateLocation(values);

      PositiveNotification('Location updated successfully');
      tableData[row.index] = values;
      setTableData([...tableData]);
      exitEditingMode();
    } catch (error) {
      NegativeNotification(error instanceof Error ? error.message : 'Failed to update location');
      exitEditingMode();
    }
  };

  return (
    <Paper withBorder radius="md" p="md">
      <PageHeader title="Location List" withActions={true} />

      <MantineReactTable
        columns={columns}
        data={tableData}
        mantinePaperProps={{ shadow: '0', withBorder: false }}
        enableDensityToggle={false} // Remove toggle density button
        initialState={{
          density: 'xs',
        }}
        mantineTableProps={{
          striped: true, // Make the table striped
          highlightOnHover: true, // Optional: Highlight rows on hover
        }}
        enableEditing
        enableRowActions
        editDisplayMode="row"
        onEditingRowSave={handleSaveRow}
      />
    </Paper>
  );
};

export default LocationsTable;
