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
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { registerLocation } from "@/app/inventory/locations/actions/register-location";
import PositiveNotification from "../Notifications/positive-notification";
import NegativeNotification from "../Notifications/negative-notification";

type FormData = {
	locationId: string;
	locationName: string;
};

const LocationRegistration: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		try {
			await registerLocation(data);

			PositiveNotification("Location registered successfully");
		} catch (error) {
			NegativeNotification(
				error instanceof Error ? error.message : "Failed to register location"
			);
		}
	};

	return (
		<Center>
			<Paper withBorder shadow="md" p="xl" w="450px">
				<Title style={{ textAlign: "center" }} order={3}>Register New Location</Title>
				<Space h="md" />
				<form onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name="locationId"
						control={control}
						defaultValue=""
						rules={{ required: "Location Id is required" }}
						render={({ field }) => (
							<TextInput
								label="Location Id"
								placeholder="Enter location Id"
								{...field}
								error={errors.locationId?.message}
							/>
						)}
					/>
					<Space h="sm" />
					<Controller
						name="locationName"
						control={control}
						defaultValue=""
						rules={{ required: "Location Name is required" }}
						render={({ field }) => (
							<TextInput
								label="Location Name"
								placeholder="Enter location name"
								{...field}
								error={errors.locationName?.message}
							/>
						)}
					/>

					<Space h="xl" />
					<Center>
						<Button type="submit">Register Location</Button>
					</Center>
				</form>
			</Paper>
		</Center>
	);
};

export default LocationRegistration;
