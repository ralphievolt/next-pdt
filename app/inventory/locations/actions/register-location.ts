'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-conn';

interface LOCATION {
  locationId: string;
  locationName: string;
}

export async function registerLocation(location: LOCATION): Promise<void> {
  const client = await clientPromise;
  const db = client.db('model_shop');
  const collection = db.collection('locations');

  const session = await getServerSession(authOptions);

  try {
    // Check if itemId already exists
    const existingItem = await collection.findOne({
      locationId: location.locationId,
    });
    if (existingItem) {
      throw new Error(`Location with locationId ${location.locationId} already exists.`);
    }

    // Insert the new item
    const result = await collection.insertOne({
      ...location,
      status: 'Active',
      quantity: 0,
      createdAt: new Date(),
      createdBy: session?.user?.email,
      updatedAt: new Date(),
      updatedBy: session?.user?.email,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to register location');
    }
  }
}
