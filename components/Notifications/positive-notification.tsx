import React from "react";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

async function PositiveNotification( message: string ) {
	return notifications.show({
		title: "Success",
		message: message,
		color: "green",
		position: "top-right",
		icon: <IconCheck size={20} />,
	});
}

export default PositiveNotification;
