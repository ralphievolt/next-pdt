"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function actionUpdateRound(data: any, id: string, key: string) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin" || session?.user?.role === "user") {
    const client = await clientPromise;
    const db = client.db("model_shop");

    try {
      const job = await db
        .collection("jobs")
        .updateOne({ _id: new ObjectId(id), "results.key": key }, [
          {
            $set: {
              "results.$.round": parseInt(data.round),
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
                      transaction: "Update Round",
                      part: `${data.shelf} - ${data.part}`,
                      status: data.status,
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
    } catch (error) {
      console.log(error);
      // return { error: "Something went wrong while saving the date" };
    }
  } else return null;
}
