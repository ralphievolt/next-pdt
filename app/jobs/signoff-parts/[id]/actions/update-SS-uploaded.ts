"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

import clientPromise from "@/lib/mongodb-conn";

export async function updateSSUploadedDate(
  ss_uploaded: string,
  jobnum: number
) {
  const session = await getServerSession(authOptions);

  try {
    if (session?.user?.role === "admin" || session?.user?.role === "user") {
      const client = await clientPromise;
      const db = client.db("model_shop");

      const job = await db
        .collection("job_details")
        .updateOne({ job_number: jobnum }, [
          {
            $set: {
              ss_uploded: new Date(ss_uploaded), // new Date("2023-12-01 16:00:00")
            },
          },
        ]);
      revalidatePath("/signoff-schedule");
    } else throw new Error("Unauthorised user");
  } catch (error) {
    return { error: "Something went wrong while saving the date" };
  }
}

