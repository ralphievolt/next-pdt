'use client';

import dayjs from 'dayjs';
import React from 'react';
import { MantineReactTable, MRT_TableOptions, type MRT_ColumnDef } from 'mantine-react-table';
import { ObjectId } from 'mongodb';
import { Paper } from '@mantine/core';
import { updateItem } from '@/app/inventory/items/actions/update-item';
import { PageHeader } from '@/components';
import NegativeNotification from '../Notifications/negative-notification';
import PositiveNotification from '../Notifications/positive-notification';

import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css';

// Define the structure of an individual item
interface Item {
  _id: ObjectId;
  itemId: string;
  itemName: string;
  itemBrand: string;
  sku: string;
  category: string;
  quantity: number;
  locationId: string;
  status: string;
  createdAt: Date;
}

interface Category {
  _id: ObjectId;
  name: string;
}

interface ItemsTableProps {
  items: Item[];
  categories: Category[];
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, categories }) => {
  const [tableData, setTableData] = React.useState<Item[]>(() => items);

  const columns = React.useMemo<MRT_ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: 'itemId',
        header: 'Item Id',
        enableEditing: false,
        size: 75,
      },
      {
        accessorKey: 'itemName',
        header: 'Item Name',
      },
      {
        accessorKey: 'itemBrand',
        header: 'Brand',
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 50,
        editVariant: 'select',
        mantineEditSelectProps: {
          data: categories.map((category) => ({
            value: category._id.toString(),
            label: category.name,
          })),
        },
        Cell: ({ cell }) => getCategoryName(cell.getValue<string>()),
      },
      {
        accessorKey: 'quantity',
        header: 'Qty',
        size: 30,
      },
      {
        accessorKey: 'locationId',
        header: 'Location Id',
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: ['Active', 'OBS'],
        },
        size: 50,
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
      await updateItem(values);

      PositiveNotification('Item updated successfully');
      tableData[row.index] = values;
      setTableData([...tableData]);
      exitEditingMode();
    } catch (error) {
      NegativeNotification(error instanceof Error ? error.message : 'Failed to update item');
      exitEditingMode();
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id.toString() === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <Paper withBorder radius="md" p="md">
      <PageHeader title="Item List" withActions={true} />
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
        positionActionsColumn="last"
        editDisplayMode="row"
        onEditingRowSave={handleSaveRow}
      />
    </Paper>
  );
};

export default ItemsTable;
