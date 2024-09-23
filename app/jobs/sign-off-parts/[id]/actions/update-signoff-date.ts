"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { nanoid } from "nanoid";

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function updateSignedOffDate(
  sodate: any,
  jobnum: number | undefined
) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin" || session?.user?.role === "user") {
    const client = await clientPromise;
    const db = client.db("model_shop");

    const job = await db.collection("jobs").updateOne({ job_number: jobnum }, [
      {
        $set: {
          state: "Signed-off",
          so_date: new Date(sodate), // new Date("2023-12-01 16:00:00")
        },
      },

      {
        $set: {
          history: {
            $concatArrays: [
              "$history",
              [
                {
                  timestamp: new Date(),
                  transaction: "Signed-off date updated manually",
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
    const qct = await db
      .collection("job_details")
      .updateOne(
        { job_number: jobnum },
        { $set: { mps_status: "Signed-off" } }
      );

    return job;
  } else return null;
}
