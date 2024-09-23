"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function updateIssueStatus(
  issues_stat: any,
  id: string,
  key: string
) {
  const session = await getServerSession(authOptions);

  
  if (session?.user?.role === "admin" || session?.user?.role === "user") {
    const client = await clientPromise;
    const db = client.db("model_shop");

    const newjob = await db
      .collection("jobs")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $unwind: "$results" },
        { $match: { "results.key": key } },
        { $limit: 1 },
      ])
      .toArray();

    const objectExist = newjob[0].results.hasOwnProperty("issue_status_opened");

    let job;

    if (issues_stat.value === "Open" && objectExist) {
      job = await db.collection("jobs").updateOne(
        { _id: new ObjectId(id), "results.key": key },
        {
          $set: {
            "results.$.issue_status": "Open",
          },
        }
      );
    }

    if (issues_stat.value === "Open" && objectExist === false) {
      job = await db.collection("jobs").updateOne(
        { _id: new ObjectId(id), "results.key": key },
        {
          $set: {
            "results.$.issue_status": "Open",
            "results.$.issue_status_opened": new Date(),
          },
        }
      );
    }

    if (issues_stat.value === "Closed") {
      job = await db.collection("jobs").updateOne(
        { _id: new ObjectId(id), "results.key": key },
        {
          $set: {
            "results.$.issue_status": "Closed",
            "results.$.issue_status_closed": new Date(),
          },
        }
      );
    }
    if (issues_stat.value === "WIP") {
      job = await db.collection("jobs").updateOne(
        { _id: new ObjectId(id), "results.key": key },
        {
          $set: {
            "results.$.issue_status": "WIP",
          },
        }
      );
    }

    await db
      .collection("jobs")
      .updateOne({ _id: new ObjectId(id), "results.key": key }, [
        {
          $set: {
            history: {
              $concatArrays: [
                "$history",
                [
                  {
                    timestamp: new Date(),
                    transaction: "Update issue status",
                    part: "NA",
                    status: "NA",
                    by: session?.user?.name,
                  },
                ],
              ],
            },
          },
        },
      ]);

    revalidatePath(`/job-signoff/`);
    return job;
  } else return null;
}
