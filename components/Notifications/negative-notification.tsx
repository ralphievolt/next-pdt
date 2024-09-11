import React from "react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

async function NegativeNotification( message: string ) {
	return notifications.show({
		title: "Error",
		message: message,
		color: "red",
		position: "top-right",
		icon: <IconX size={20} />,
	});
}

export default NegativeNotification;
