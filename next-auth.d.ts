// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      email: any;
      role: string;
    };
  }

  interface JWT {
    role: string;
  }
}
