import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { fetchAccessToken } from './app/api/fetch/userFetch';
import { RefreshTokenRes } from './types/response';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
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
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      // JWT 자체의 만료 시간 추출
      const decodedToken = jwt.decode(token.accessToken) as JwtPayload | null;
      const accessTokenExpires = decodedToken?.exp ? decodedToken?.exp * 1000 : 0; // 밀리초 단위로 변환

      // 토큰 만료 확인
      const shouldRefreshToken = Date.now() > accessTokenExpires;
      if (shouldRefreshToken) {
        try {
          console.log('토큰 만료됨.', Date.now() + ' > ' + accessTokenExpires);
          const res = await fetchAccessToken(token.refreshToken);
          if (res.ok) {
            const resJson: RefreshTokenRes = await res.json();
            return {
              ...token,
              accessToken: resJson.accessToken,
            };
          } else {
            if (res.status === 401) {
              // 인증 되지 않음(리플래시 토큰 인증 실패)
              console.log('리플래시 토큰 인증 실패. 로그인 페이지로 이동', await res.json());
            }
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error(error);
            return {
              ...token,
              error: error.message,
            };
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
});
