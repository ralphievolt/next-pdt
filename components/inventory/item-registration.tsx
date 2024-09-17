"use client";

import React from "react";
import {
	Button,
	Center,
	NumberInput,
	Space,
	TextInput,
	Title,
	Paper,
	Select,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { registerItem } from "@/app/inventory/items/actions/register-item";
import PositiveNotification from "../Notifications/positive-notification";
import NegativeNotification from "../Notifications/negative-notification";

type FormData = {
	itemId: string;
	itemName: string;
	itemBrand: string;
	quantity: number;
	sku: string;
	category: string;
};

type Category = {
	_id: string;
	name: string;
};

type ItemRegistrationProps = {
	categories: Category[]; // Directly pass the parsed categories array
};

const ItemRegistration: React.FC<ItemRegistrationProps> = ({ categories }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		try {
			await registerItem(data);

			PositiveNotification("Item registered successfully");
		} catch (error) {
			NegativeNotification(
				error instanceof Error ? error.message : "Failed to register item"
			);
		}
	};

	return (
		<Center>
			<Paper withBorder shadow="md" p="xl" w="450px">
				<Title style={{ textAlign: "center" }} order={3}>Register New Item</Title>
				<Space h="md" />
				<form onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name="itemId"
						control={control}
						defaultValue=""
						rules={{ required: "Item Part Number is required" }}
						render={({ field }) => (
							<TextInput
								label="Item Part Number"
								placeholder="Enter item part number"
								{...field}
								error={errors.itemId?.message}
							/>
						)}
					/>
					<Space h="sm" />
					<Controller
						name="itemName"
						control={control}
						defaultValue=""
						rules={{ required: "Item Name is required" }}
						render={({ field }) => (
							<TextInput
								label="Item Name"
								placeholder="Enter item name"
								{...field}
								error={errors.itemName?.message}
							/>
						)}
					/>
					<Space h="sm" />
					<Controller
						name="itemBrand"
						control={control}
						defaultValue=""
						rules={{ required: "Brand Name is required" }}
						render={({ field }) => (
							<TextInput
								label="Brand Name"
								placeholder="Enter brand name"
								{...field}
								error={errors.itemBrand?.message}
							/>
						)}
					/>
					<Space h="sm" />
					<Controller
						name="sku"
						control={control}
						defaultValue=""
						render={({ field }) => (
							<TextInput
								label="SKU"
								placeholder="Enter additional information"
								{...field}
								error={errors.sku?.message}
							/>
						)}
					/>
					<Space h="sm" />
					<Controller
						name="category"
						control={control}
						defaultValue=""
						rules={{ required: "Category is required" }}
						render={({ field }) => (
							<Select
								label="Category"
								placeholder="Select category"
								data={categories.map((category) => ({
									value: category._id,
									label: category.name,
								}))}
								{...field}
								error={errors.category?.message}
							/>
						)}
					/>
					<Space h="sm" />
					<Controller
						name="quantity"
						control={control}
						defaultValue={1}
						rules={{ required: "Quantity is required", min: 1 }}
						render={({ field }) => (
							<NumberInput
								label="Quantity"
								placeholder="Enter quantity"
								{...field}
								error={
									errors.quantity &&
									"Quantity is required and must be at least 1"
								}
							/>
						)}
					/>
					<Space h="xl" />
					<Center>
						<Button type="submit">Register Item</Button>
					</Center>
				</form>
			</Paper>
		</Center>
	);
};

export default ItemRegistration;
