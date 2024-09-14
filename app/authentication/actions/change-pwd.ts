'use server';

import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

interface ChangePwdValues {
  oldpassword: string;
  password: string;
}

export const changePwd = async (values: ChangePwdValues): Promise<void> => {
  const { oldpassword, password } = values;
  const session = await getServerSession(authOptions);

  try {
    if (!session || !session.user || !session.user.email) {
      throw new Error('Session or user email not found');
    }

    const email = session.user.email;

    await connectDB(); // Ensure the database is connected
    const userFound = await User.findOne({ email });

    if (!userFound) throw new Error('User not found');


    const passwordMatch = await bcrypt.compare(oldpassword, userFound.password);

    if (!passwordMatch) throw new Error('Wrong Password');

    if (passwordMatch) {
      const hashedPassword = await bcrypt.hash(password, 10); // Use newpwd instead of password
      const filter = { email: email };
      const update = { password: hashedPassword, updatedAt: new Date() };
      await User.findOneAndUpdate(filter, update);
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
