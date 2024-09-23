"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

dayjs.extend(weekOfYear);

export async function setWeekNumberForReadyForSOJob() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "admin" || session?.user?.role === "user") {
    const client = await clientPromise;
    const db = client.db("model_shop");

    const readyForSOJobs = await db
      .collection("job_details")
      .find({ mps_status: "Ready For Sign-off - 4" })
      .toArray();

    readyForSOJobs.map(async (item) => {
      await db.collection("so_schedule").updateOne(
        { job_number: item.job_number },
        {
          $set: {
            sched_status: dayjs().week().toString(),
            monday: "---",
            tuesday: "---",
            wednesday: "---",
            thursday: "---",
            friday: "---",
          },
        }
      );
    });

    revalidatePath("/signoff-schedule");
  } else return null;
}
