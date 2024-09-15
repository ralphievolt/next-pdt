import LocationsTable from '@/components/Table/LocationsTable';
import clientPromise from '@/lib/mongodb-conn';

export const revalidate = 0; // Disable caching

export default async function TablePage() {
  const client = await clientPromise;
  const db = client.db('petra');
  const collection = db.collection('locations');

  try {
    const results = await collection.find().toArray();

    const data = JSON.parse(JSON.stringify(results));

    return <LocationsTable items={data} />;
  } catch (error) {
    console.error('Error registering item:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to register item');
    }
  }
}
