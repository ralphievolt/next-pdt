'use server';

import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-conn';

interface ITEM {
  itemId: string;
  itemName: string;
  itemBrand: string;
  quantity: number;
  sku: string;
  category: string; // This will be converted to ObjectId
}

export async function registerItem(item: ITEM): Promise<void> {
  const client = await clientPromise;
  const db = client.db('model_shop');
  const collection = db.collection('items');

  const session = await getServerSession(authOptions);

  try {
    // Check if itemId already exists
    const existingItem = await collection.findOne({ itemId: item.itemId });
    if (existingItem) {
      throw new Error(`Item with itemId ${item.itemId} already exists.`);
    }

    // Convert category to ObjectId
    const categoryObjectId = new ObjectId(item.category);

    // Insert the new item
    const result = await collection.insertOne({
      ...item,
      category: categoryObjectId, // Save as ObjectId
      locationId: 'Not Assigned',
      status: 'Active',
      createdAt: new Date(),
      createdBy: session?.user?.email,
      updatedAt: new Date(),
      updatedBy: session?.user?.email,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to register item');
    }
  }
}
