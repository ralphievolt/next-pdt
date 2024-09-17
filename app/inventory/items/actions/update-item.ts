"use server";

import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb-conn";


interface ITEM {
	itemId: string;
	itemName: string;
	itemBrand: string;
	category: string;
	quantity: number;
	sku: string;
	status: string;
}

export async function updateItem(item: ITEM): Promise<void> {
	const client = await clientPromise;
	const db = client.db("model_shop");
	const locationCollection = db.collection("items");

	try {
		await locationCollection.updateOne(
			{ itemId: item.itemId },
			{
				$set: {
					itemName: item.itemName,
					itemBrand: item.itemBrand,
					sku: item.sku,
					category: new ObjectId(item.category),
					quantity: item.quantity,
					status: item.status,
				},
			}
		);
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("Failed to update location");
		}
	}
}
