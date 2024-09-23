import JobListTable from "@/components/job-list";
import clientPromise from "@/lib/mongodb-conn";
import Error from "@/components/error-result"

export default async function Home({
  params,
}: {
  params: { job_number: string };
}) {
  const job_number = params.job_number;
  const client = await clientPromise;
  const db = client.db("model_shop");
  let formatedData: Object[] = [];

  try {
    const jobs = await db
      .collection("jobs")
      .aggregate([
        {
          $match: {
            job_number: parseInt(job_number),
          },
        },
        // get the last object in history array
        { $addFields: { last_updated_by: { $last: "$history" } } },
        {
          $project: {
            _id: 1,
            job_number: 1,
            brand: 1,
            state: 1,
            delivered_date: 1,
            so_date: 1,
            results: 1,
            last_update: 1,
            last_updated_by: 1,
          },
        },
        {
          $unwind: {
            path: "$results",
          },
        },
        {
          $group: {
            _id: {
              id: "$_id",
              job_num: "$job_number",
              brand: "$brand",
              state: "$state",
              delivered_date: "$delivered_date",
              so_date: "$so_date",
              last_update: "$last_update",
              last_updated_by: "$last_updated_by",
            },
            approved: {
              $sum: {
                $cond: {
                  if: {
                    $eq: ["$results.status", "Approved"],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            rejected: {
              $sum: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$results.status", "Approved"] },
                      { $ne: ["$results.status", "Cancelled"] },
                    ],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        { $sort: { "_id.last_update": -1 } },
        // { $limit: 20 },
      ])
      .toArray();
      if (jobs) {
        jobs.map((job) => {
          formatedData.push({
            _id: job._id.id,
            job_number: job._id.job_num,
            brand: job._id.brand,
            state: job._id.state,
            delivered_date: job._id.delivered_date,
            so_date: job._id.so_date,
            last_update: job._id.last_update,
            updated_by: job._id.last_updated_by.by,
            rate: Math.round(
              (job.approved / (job.approved + job.rejected)) * 100
            ),
          });
        });
      }
    // to create a serializable object
    const data = JSON.parse(JSON.stringify(formatedData));

    return <JobListTable jobslist={data} />;
  } catch (e) {
    return <Error/>;
  }
}
