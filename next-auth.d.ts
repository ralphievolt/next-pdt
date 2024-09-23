// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      email: any;
      name: string;
      role: string;
    };
  }

  interface JWT {
    role: string;
  }
}
