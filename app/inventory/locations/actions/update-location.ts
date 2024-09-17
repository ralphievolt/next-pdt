'use server';

import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-conn';

interface LOCATION {
  locationId: string;
  locationName: string;
  quantity: number;
  status: string;
}

export async function updateLocation(location: LOCATION): Promise<void> {
  const client = await clientPromise;
  const db = client.db('model_shop');
  const locationCollection = db.collection('locations');

  const session = await getServerSession(authOptions);


  try {
    await locationCollection.updateOne(
      { locationId: location.locationId },
      {
        $set: {
          locationId: location.locationId,
          locationName: location.locationName,
          quantity: location.quantity,
          status: location.status,
          updatedAt: new Date(),
          updatedBy: session?.user?.email,
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to update location');
    }
  }
}
