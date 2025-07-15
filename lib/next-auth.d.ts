import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: number;
    role: string;
  }

  interface Session {
    user: User & {
      id: number;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    role: string;
  }
}