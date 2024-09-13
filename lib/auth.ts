import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    credentials({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({
          email: credentials?.email,
        }).select('+password');

        if (!user) throw new Error('Wrong Email');

        const passwordMatch = await bcrypt.compare(credentials!.password, user.password);

        if (!passwordMatch) throw new Error('Wrong Password');
        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role as string;
      return session;
    }
    
  },
};
