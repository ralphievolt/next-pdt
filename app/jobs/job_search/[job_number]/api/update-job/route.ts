import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("model_shop");
  const { job_number, brand, state } = await req.json();
  const session = await getServerSession(authOptions);

  try {
    if (
      !session &&
      (session?.user?.role !== "user" || session?.user?.role !== "admin")
    ) {
      throw "Unauthorised user";
    }

    let job;

    if (state !== "Dispatched") {
      job = await db
        .collection("jobs")
        .updateOne({ job_number: parseInt(job_number) }, [
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
        ]);
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
