"use server";

import clientPromise from "@/lib/mongodb-conn";


interface Transaction {
  itemId: string;
  transactionType: "IN" | "OUT" | "TRANSFER";
  sourceLocationId?: string;
  destinationLocationId: string;
  quantity: number;
  date: Date;
}

export async function updateItemLocationAndRecordTransaction(
  transaction: Transaction
): Promise<void> {
  let client;
  try {
    client = await clientPromise;
    const db = client.db("petra");
    const itemsCollection = db.collection("items");
    const transactionsCollection = db.collection("transactions");

    // Update item location and quantity
    if (transaction.transactionType === "TRANSFER") {
      await itemsCollection.updateOne(
        { itemId: transaction.itemId },
        { $set: { locationId: transaction.destinationLocationId } }
      );
    } else if (transaction.transactionType === "IN") {
      await itemsCollection.updateOne(
        { itemId: transaction.itemId },
        {
          $set: { locationId: transaction.destinationLocationId },
          $inc: { quantity: transaction.quantity },
        }
      );
    } else if (transaction.transactionType === "OUT") {
      await itemsCollection.updateOne(
        { itemId: transaction.itemId },
        { $inc: { quantity: -transaction.quantity } }
      );
    }

    // Record the transaction
    await transactionsCollection.insertOne(transaction);
  } catch (error) {
    console.error(
      "Error updating item location and recording transaction:",
      error
    );
    throw new Error("Failed to update item location and record transaction");
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// // Example transaction
// const transaction: Transaction = {
//   itemId: "item123",
//   transactionType: "TRANSFER",
//   sourceLocationId: "loc1",
//   destinationLocationId: "loc2",
//   quantity: 10,
//   date: new Date(),
// };

// updateItemLocationAndRecordTransaction(transaction).catch(console.error);
