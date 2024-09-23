"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function actionResetScheduled(arr: any) {
  const client = await clientPromise;
  const db = client.db("model_shop");

  arr.map(async (item: any) => {
    await db.collection("jobs").updateOne(
      { job_number: item.job_number },
      {
        $set: {
          state: "In-progress",
        },
      }
    );
  });
  revalidatePath("/job-list");
}
