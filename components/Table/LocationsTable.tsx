"use client";

import React from "react";
import { Paper } from "@mantine/core";
import {
	type MRT_ColumnDef,
	MantineReactTable,
	MRT_TableOptions,
} from "mantine-react-table";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

import { updateLocation } from "@/app/dashboard/inventory/locations/actions/update-location";
import PositiveNotification from "../Notifications/positive-notification";
import NegativeNotification from "../Notifications/negative-notification";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'

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
				accessorKey: "locationId",
				header: "Location Id",
				size: 75,
			},
			{
				accessorKey: "locationName",
				header: "Name",
			},

			{
				accessorKey: "quantity",
				header: "Qty",
				size: 30,
			},
			{
				accessorKey: "status",
				header: "Status",
				editVariant: "select",
				mantineEditSelectProps: {
					data: ["Active", "Deactivated"],
				},
				size: 30,
			},
			{
        accessorKey: "createdAt",
        header: "Created",
        enableEditing: false,
        Cell: ({ cell }) => dayjs(cell.getValue<Date>()).format("YYYY-MM-DD"),
        size: 50,
      },
		],
		[]
	);

	const handleSaveRow: MRT_TableOptions<Item>["onEditingRowSave"] = async ({
		exitEditingMode,
		row,
		values,
	}) => {
		try {
			await updateLocation(values);

			PositiveNotification("Location updated successfully");
			tableData[row.index] = values;
			setTableData([...tableData]);
			exitEditingMode();
		} catch (error) {
			NegativeNotification(
				error instanceof Error ? error.message : "Failed to update location"
			);
			exitEditingMode();
		}
	};

	return (
		<Paper withBorder radius="md" p="md">
			<MantineReactTable
				columns={columns}
				data={tableData}
				mantinePaperProps={{ shadow: "0", withBorder: false }}
				enableDensityToggle={false} // Remove toggle density button
				initialState={{
					density: "xs",
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
