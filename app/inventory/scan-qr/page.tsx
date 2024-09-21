import ScanQrCode from '@/components/inventory/scan-item-qr';
import clientPromise from '@/lib/mongodb-conn';

export const revalidate = 0;

export default async function Form() {
  const client = await clientPromise;
  const db = client.db('model_shop');
  const categoriesCollection = db.collection('categories');

  try {
    const categories = await categoriesCollection
      .find({
        status: 'Active',
      })
      .toArray();

    return <ScanQrCode categories={JSON.parse(JSON.stringify(categories))} />;
  } catch (error) {
    console.error('Error registering item:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to register item');
    }
  }
}
