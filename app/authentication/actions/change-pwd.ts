'use server';

import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { connectDB } from '@/lib/mongodb';

import { authOptions } from "@/lib/auth"

import User from '@/models/User';

export const changePwd = async (values: any) => {
  const { password, newpwd } = values;
 
  const session = await getServerSession( authOptions)
 



  console.log(session?.user?.email)

  try {
    // const userFound = await User.findOne({ email });
    // if (userFound) {
    //   return {
    //     error: 'Email already exists!',
    //   };
    // }
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = new User({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   role: 'viewer',
    // });
    // await user.save();
  } catch (e) {
    console.log(e);
  }
};
