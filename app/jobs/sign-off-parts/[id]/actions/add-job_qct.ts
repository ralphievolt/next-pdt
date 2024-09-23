"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function addJobInQCT(jobnum: number | undefined) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin" || session?.user?.role === "user") {
    const client = await clientPromise;
    const db = client.db("model_shop");

    let qct = await db.collection("qct_inspection").updateOne(
      { job_number: jobnum },
      {
        $setOnInsert: {
          status: "---",
          qct: "---",
          engineer: "---",
          history: [],
        },
      },
      { upsert: true }
    );

    return qct;
  } else return null;
}
