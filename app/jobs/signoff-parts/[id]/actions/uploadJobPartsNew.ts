"use server";

import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

const reader = require("xlsx");

import clientPromise from "@/lib/mongodb-conn";
import { revalidatePath } from "next/cache";

export async function uploadJobPartsNew(
  id: string,
  Shelf: string,
  Description: string,
  PartNumber: string,
  Assort: string

) {
  const session = await getServerSession(authOptions);
  const client = await clientPromise;
  const db = client.db("model_shop");

  try {
    if (
      !session &&
      (session?.user?.role !== "user" || session?.user?.role !== "admin")
    ) {
      throw "Unauthorised user";
    }

    const job = await db
      .collection("jobs")
      .updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            results: {
              $concatArrays: [
                "$results",
                [
                  {
                    key: nanoid(),
                    entry_date: new Date(),
                    entry_by: session?.user?.name,
                    round: 1,
                    issue_status: "",
                    shelf: Shelf,
                    status: "Not Stage",
                    part: Description,
                    issue: "",
                    detail: PartNumber,
                    action: "",
                    responsible: "",
                    assort: Assort,
                  },
                ],
              ],
            },
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
                    transaction: "Upload Job Parts",
                    part: PartNumber,
                    status: "Not Stage",
                    by: session?.user?.name,
                  },
                ],
              ],
            },
          },
        },

        {
          $set: {
            last_update: new Date(),
          },
        },
      ]);
    revalidatePath(`/job-signoff/`);
  } catch (error) {
    return error;
  }
}
