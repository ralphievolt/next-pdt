"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import dayjs from "dayjs";
import { nanoid } from "nanoid";

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function updateDeliveryDate(
  delivery: any,
  jobnum: number | undefined
) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin" || session?.user?.role === "user") {
    const client = await clientPromise;
    const db = client.db("model_shop");

    const job = await db.collection("jobs").updateOne({ job_number: jobnum }, [
      {
        $set: {
          state: "Delivered",
          delivered_date: new Date(delivery), // new Date("2023-12-01 16:00:00")
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
                  transaction: "Delivered date updated manually",
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
        { $set: { mps_status: "100% Signed-off & Delivered - 1" } }
      );

    const so_schedule = await db
      .collection("so_schedule")
      .updateOne(
        { job_number: jobnum },
        { $set: { state: `Delivered: ${dayjs().format("YYYY-MM-DD")}` } }
      );

    return job;
  } else return null;
}
