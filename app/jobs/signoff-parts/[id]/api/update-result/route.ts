import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb-conn";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import { nanoid } from "nanoid";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db("model_shop");
  const data = await request.json();
  const session = await getServerSession(authOptions);

  try {
    if (
      !session &&
      (session?.user?.role !== "user" || session?.user?.role !== "admin")
    ) {
      throw "Unauthorised user";
    }
    let job;
    let date_started = ["Approved", "Rejected", "Pre-Inspected"].includes(
      data.status
    )
      ? true
      : false;

    if (date_started && data.hasOwnProperty("date_started") === false) {
      job = await db.collection("jobs").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            "results.$[elem].shelf": data.shelf,
            "results.$[elem].part": data.part,
            "results.$[elem].assort": data.assort,
            "results.$[elem].status": data.status,
            "results.$[elem].issue": data.issue,
            "results.$[elem].detail": data.detail,
            "results.$[elem].action": data.action,
            "results.$[elem].round": parseInt(data.round),
            "results.$[elem].responsible": data.responsible,
            "results.$[elem].entry_by": session?.user?.name,
            "results.$[elem].entry_date": new Date(),
            "results.$[elem].date_started": new Date(),
            last_update: new Date(),
          },
        }, // Update the grade of the specific course
        {
          arrayFilters: [{ "elem.key": data.key }], // Identify the specific course in the array
        }
      );

      await db.collection("jobs").updateOne({ _id: new ObjectId(id) }, [
        {
          $set: {
            history: {
              $concatArrays: [
                "$history",
                [
                  {
                    timestamp: new Date(),
                    transaction: "Update Result",
                    part: `${data.shelf} - ${data.part}`,
                    status: data.status,
                    by: session?.user?.name,
                    //The question mark dot (?.) syntax is called optional chaining in TypeScript.
                  },
                ],
              ],
            },
          },
        },
      ]);

      return NextResponse.json(job, { status: 201 });
    }

    job = await db.collection("jobs").updateOne(
      { _id: new ObjectId(id) },

      {
        $set: {
          "results.$[elem].shelf": data.shelf,
          "results.$[elem].part": data.part,
          "results.$[elem].assort": data.assort,
          "results.$[elem].status": data.status,
          "results.$[elem].issue": data.issue,
          "results.$[elem].detail": data.detail,
          "results.$[elem].action": data.action,
          "results.$[elem].round": parseInt(data.round),
          "results.$[elem].responsible": data.responsible,
          "results.$[elem].entry_by": session?.user?.name,
          "results.$[elem].entry_date": new Date(),
          last_update: new Date(),
        },
      }, // Update the grade of the specific course
      {
        arrayFilters: [{ "elem.key": data.key }], // Identify the specific course in the array
      }
    );

    await db.collection("jobs").updateOne({ _id: new ObjectId(id) }, [
      {
        $set: {
          history: {
            $concatArrays: [
              "$history",
              [
                {
                  timestamp: new Date(),
                  transaction: "Update Result",
                  part: `${data.shelf} - ${data.part}`,
                  status: data.status,
                  by: session?.user?.name,
                  //The question mark dot (?.) syntax is called optional chaining in TypeScript.
                },
              ],
            ],
          },
        },
      },
    ]);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error in updating result" },
      { status: 500 }
    );
  }
}
