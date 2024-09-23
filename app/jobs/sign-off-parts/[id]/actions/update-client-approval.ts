"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

import clientPromise from "@/lib/mongodb-conn";

export async function updateClientApproval(
  client_approvaldate: string,
  jobnum: number
) {
  const session = await getServerSession(authOptions);

  try {
    if (session?.user?.role === "admin" || session?.user?.role === "user") {
      const client = await clientPromise;
      const db = client.db("model_shop");

      const job = await db
        .collection("so_schedule")
        .updateOne({ job_number: jobnum }, [
          {
            $set: {
              client_approval: new Date(client_approvaldate), // new Date("2023-12-01 16:00:00")
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
      revalidatePath("/signoff-schedule");
    } else throw new Error("Unauthorised user");
  } catch (error) {
    return { error: "Something went wrong while saving the date" };
  }
}
