"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function actionJobExist(job_num: any) {
  const client = await clientPromise;
  const db = client.db("model_shop");

  const job = await db
    .collection("job_details")
    .findOne({ job_number: parseInt(job_num) });

  if (job === null) return JSON.parse(JSON.stringify(job));
  else return JSON.parse(JSON.stringify(job));
}
