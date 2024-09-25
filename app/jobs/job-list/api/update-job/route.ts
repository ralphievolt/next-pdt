import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb-conn";
import { getServerSession, Session } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("model_shop");
  const { job_number, brand, state } = await req.json();
  const session = (await getServerSession(authOptions)) as Session | null;


  try {
    if ((!session && !session) || (session.user.role !== 'user' && session.user.role !== 'admin')) {
      throw new Error(`Unauthorised user`);
    }

    let job;

    const job_num = parseInt(job_number);

    if (state !== "Dispatched") {
      job = await db.collection("jobs").updateOne(
        { job_number: job_num },
        [
          {
            $set: {
              // last_update: new Date(),
              brand: brand,
              state: state,
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
                      transaction: "Update Job State",
                      part: "NA",
                      status: "NA",
                      by: session?.user?.name,
                    },
                  ],
                ],
              },
            },
          },
        ]
        // use array to encapsulate all the $set like above- this methos eliminate the eslint error of push below
        // $push: {
        //   history: {
        //     timestamp: new Date(),
        //     transaction: "Update Job State",
        //     part: "NA",
        //     status: "NA",
        //     by: session?.user?.name,
        //   },
        // },
      );
    }
    return NextResponse.json(job, { status: 201 });
    // } else throw new Error("Unauthorized User!");
  } catch (error) {
    return NextResponse.json(
      { error: "Error in updating job" },
      { status: 500 }
    );
  }
}
