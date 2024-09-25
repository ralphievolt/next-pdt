import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb-conn";
import { getServerSession, Session } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db("model_shop");
  const data = await request.json();
  const session = (await getServerSession(authOptions)) as Session | null;


  try {
    if ((!session && !session) || (session.user.role !== 'user' && session.user.role !== 'admin')) {
      throw new Error(`Unauthorised user`);
    }

    let date_started = ["Approved", "Rejected", "Pre-Inspected"].includes(
      data.status
    )
      ? true
      : false;

    let job;
    if (date_started) {
      job = await db.collection("jobs").updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            results: {
              $concatArrays: [
                "$results",
                [
                  {
                    ...data,
                    key: nanoid(),
                    entry_date: new Date(),
                    entry_by: session?.user?.name,
                    round: 1,
                    date_started: new Date(),
                    issue_status: data.status === "Rejected" ? "Open" : "",
                    issue_status_opened:
                      data.status === "Rejected" ? new Date() : null,
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
                    transaction: "Add New Result",
                    part: `${data.shelf} - ${data.part}`,
                    status: data.status,
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
      revalidatePath(`/jobs/${id}`); 
      return NextResponse.json(job, { status: 201 });
    }

    job = await db.collection("jobs").updateOne({ _id: new ObjectId(id) }, [
      {
        $set: {
          results: {
            $concatArrays: [
              "$results",
              [
                {
                  ...data,
                  key: nanoid(),
                  entry_date: new Date(),
                  entry_by: session?.user?.name,
                  round: 1,
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
                  transaction: "Add New Result",
                  part: `${data.shelf} - ${data.part}`,
                  status: data.status,
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

    revalidatePath(`/jobs/${id}`); 
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error in adding new result" },
      { status: 500 }
    );
  }
}
