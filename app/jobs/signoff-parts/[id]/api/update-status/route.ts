import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { nanoid } from 'nanoid';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb-conn';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db('model_shop');
  const stat = await request.json();
  const session = (await getServerSession(authOptions)) as Session | null;

  try {
    
    if ((!session && !session) || (session.user.role !== 'user' && session.user.role !== 'admin')) {
      throw new Error(`Unauthorised user`);
    }

    let job;
    const arrayDaysName = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    const jobNumber = await db.collection('jobs').findOne({ _id: new ObjectId(id) });

    if (stat === 'Signed-off' || stat === 'Scheduled') {
      await db
        .collection('so_schedule')
        .updateOne(
          { job_number: jobNumber?.job_number },
          { $set: { [arrayDaysName[new Date().getDay()]]: 'S' } }
        );
    }

    if (stat === 'Delivered') {
      job = await db.collection('jobs').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            last_update: new Date(),
            state: stat,
            delivered_date: new Date(),
          },
        }
      );

      const qct = await db
        .collection('job_details')
        .updateOne(
          { job_number: jobNumber?.job_number },
          { $set: { mps_status: '100% Signed-off & Delivered - 1' } }
        );

      const so_schedule = await db
        .collection('so_schedule')
        .updateOne(
          { job_number: jobNumber?.job_number },
          { $set: { state: `Delivered: ${dayjs().format('YYYY-MM-DD')}` } }
        );
    } else if (stat === 'Signed-off') {
      job = await db.collection('jobs').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            last_update: new Date(),
            state: stat,
            so_date: new Date(),
          },
        }
      );
      const qct = await db
        .collection('job_details')
        .updateOne({ job_number: jobNumber?.job_number }, { $set: { mps_status: 'Signed-off' } });
    } else {
      job = await db.collection('jobs').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            last_update: new Date(),
            state: stat,
          },
        }
      );
    }

    await db.collection('jobs').updateOne({ _id: new ObjectId(id) }, [
      {
        $set: {
          history: {
            $concatArrays: [
              '$history',
              [
                {
                  timestamp: new Date(),
                  transaction: 'Update Job State to ' + stat,
                  part: 'NA',
                  status: stat,
                  by: session?.user?.name,
                },
              ],
            ],
          },
        },
      },
    ]);

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to update job status');
    }
  }
}
