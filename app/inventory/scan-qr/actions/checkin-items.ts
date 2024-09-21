'use server';

import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-conn';

interface TRANSACTION {
  locationId: string;
  itemId: string;
}

export async function checkinItems(items: TRANSACTION[]): Promise<void> {
  const client = await clientPromise;
  const db = client.db('model_shop');
  const collection = db.collection('item_transactions');

  const session = await getServerSession(authOptions);

  // Add username and timestamp to each item
  const itemsWithMetadata = items.map((item) => ({
    ...item,
    createdBy: session?.user?.email,
    createdAt: new Date(),
  }));

  try {
    const result = await collection.insertMany(itemsWithMetadata);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to register item');
    }
  }
}
