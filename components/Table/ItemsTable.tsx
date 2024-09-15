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

import { updateItem } from "@/app/dashboard/inventory/items/actions/update-item";
import PositiveNotification from "../Notifications/positive-notification";
import NegativeNotification from "../Notifications/negative-notification";

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
				accessorKey: "itemId",
				header: "Item Id",
				enableEditing: false,
				size: 75,
			},
			{
				accessorKey: "itemName",
				header: "Name",
			},
			{
				accessorKey: "itemBrand",
				header: "Brand",
			},
			{
				accessorKey: "sku",
				header: "SKU",
			},
			{
				accessorKey: "category",
				header: "Category",
				size: 50,
				editVariant: "select",
				mantineEditSelectProps: {
					data: categories.map((category) => ({
						value: category._id.toString(),
						label: category.name,
					})),
				},
				Cell: ({ cell }) => getCategoryName(cell.getValue<string>()),
			},
			{
				accessorKey: "quantity",
				header: "Qty",
				size: 30,
			},
			{
				accessorKey: "locationId",
				header: "Location Id",
				enableEditing: false,
				size: 50,
			},
			{
				accessorKey: "status",
				header: "Status",
				editVariant: "select",
				mantineEditSelectProps: {
					data: ["Active", "OBS"],
				},
				size: 50,
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

			await updateItem(values);

			PositiveNotification("Item updated successfully");
			tableData[row.index] = values;
			setTableData([...tableData]);
			exitEditingMode();
		} catch (error) {
			NegativeNotification(
				error instanceof Error ? error.message : "Failed to update item"
			);
			exitEditingMode();
		}
	};

	const getCategoryName = (categoryId: string) => {
		const category = categories.find((cat) => cat._id.toString() === categoryId);
		return category ? category.name : categoryId;
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

export default ItemsTable;
