import ItemsTable from "@/components/Table/ItemsTable";
import clientPromise from "@/lib/mongodb-conn";


export const revalidate = 0; // Disable caching

export default async function TablePage() {
	const client = await clientPromise;
	const db = client.db("model_shop");
	const itemsCollection = db.collection("items");
	const categoriesCollection = db.collection("categories");

	try {
		const items = await itemsCollection
			.aggregate([
				{
					$lookup: {
						from: "categories",
						localField: "category",
						foreignField: "_id",
						as: "categoryDetails",
					},
				},
				{
					$unwind: "$categoryDetails",
				},
				{
					$project: {
						itemId: 1,
						itemName: 1,
						itemBrand: 1,
						quantity: 1,
						sku: 1,
						category: "$categoryDetails.name",
						createdAt: 1,
						locationId:1,
						status:1
					},
				},
			])
			.toArray();

		const categories = await categoriesCollection
			.find({ status: "Active" })
			.sort({name:1})
			.toArray();

		return (
				<ItemsTable
					items={JSON.parse(JSON.stringify(items))}
					categories={JSON.parse(JSON.stringify(categories))}
				/>
		);
	} catch (error) {
		console.error("Error fetching items:", error);
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("Failed to fetch items");
		}
	}
}
