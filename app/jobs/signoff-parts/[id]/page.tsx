import ResultForm from "@/components/so-parts-list/index"
import clientPromise from "@/lib/mongodb-conn";
import { ObjectId } from "mongodb";

export default async function Home({ params }: { params: { id: string } }) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db("model_shop");

  try {
    const job = await db
      .collection("jobs")
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "job_details",
            localField: "job_number",
            foreignField: "job_number",
            as: "details",
          },
        },
        {
          $lookup: {
            from: "qct_inspection",
            localField: "job_number",
            foreignField: "job_number",
            as: "qct_info",
          },
        },
        {
          $lookup: {
            from: "so_schedule",
            localField: "job_number",
            foreignField: "job_number",
            as: "signoff",
          },
        },
        {
          $lookup: {
            from: "qct_inspection",
            localField: "job_number",
            foreignField: "job_number",
            as: "qct_info",
          },
        },
        {
          $addFields: {
            qct: "$qct_info.qct",
            engineer: "$qct_info.engineer",
            project_manager: "$details.project_manager",
            maker: "$details.maker",
            coordinator: "$signoff.coordinator",
            inspector: "$signoff.inspector",
          },
        },

        {
          $project: {
            results: 1,
            job_number: 1,
            brand: 1,
            qct: 1,
            engineer: 1,
            project_manager: 1,
            maker: 1,
            coordinator: 1,
            inspector: 1,
          },
        },
      ])
      .toArray();
    // to create a serializable object
 
    const data = JSON.parse(JSON.stringify(job));
    return <ResultForm job={data} job_id={id}/>;
  } catch (error) {
    console.log("Error: ", error);
    return <>Error in displaying data</>;
  }
}
