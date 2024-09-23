"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import dayjs from "dayjs";

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function updateWTS(shipping: any, jobnum: number | undefined) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin" || session?.user?.role === "user") {
    const client = await clientPromise;
    const db = client.db("model_shop");

    const qct = await db
      .collection("job_details")
      .updateOne(
        { job_number: jobnum },
        { $set: { ship_date: new Date(shipping) } }
      );
    revalidatePath("/signoff-schedule");
    return qct;
  } else return null;
}
