import { NextResponse, NextRequest } from "next/server";
import { nanoid } from "nanoid";
import clientPromise from "@/lib/mongodb-conn";
import { getServerSession, Session } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation'

export async function POST(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("model_shop");
  const { job_number, brand, state } = await req.json();
  const session = (await getServerSession(authOptions)) as Session | null;



  let job;

  try {

    if ((!session && !session) || (session.user.role !== 'user' && session.user.role !== 'admin')) {
      throw new Error(`Unauthorised user`);
    }

    const count = await db
      .collection("jobs")
      .find({ job_number: parseInt(job_number) })
      .toArray();

    if (count.length > 0) {
      return NextResponse.json(
        { error: "Duplicate Job Number" },
        { status: 505 }
      );
    }

    job = await db.collection("jobs").insertOne({
      job_number: parseFloat(job_number),
      brand,
      state,
      last_update: new Date(),
      delivered_date: "----",
      so_date: "----",
      history: [
        {
          timestamp: new Date(),
          transaction: "Add New Job",
          by: session?.user?.name,
          part: "NA",
          status: "NA",
        },
      ],
      results: [
        {
          key: nanoid(),
          shelf: "B1S1",
          status: "Not Stage",
          part: "Templates",
          issue: "",
          detail: "",
          action: "",
          responsible: "",
          round:1,
          entry_date: new Date(),
          entry_by: session?.user?.name,
        },
      ],
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
