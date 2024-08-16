import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const res = await fetch(`${SERVER}/users/login`, {
          method: 'POST',
          headers: {
            'client-id': `${DBNAME}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const resJson = await res.json();
        if (resJson.ok) {
          const user = resJson.item;
          return {
            id: user._id,
            type: user.type,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            image: user.image && SERVER + user.image,
            accessToken: user.token.accessToken,
            refreshToken: user.token.refreshToken,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', //default
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: '/login', // default = '/auto/login'
  },
  callbacks: {
    async signIn({ user }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
});
