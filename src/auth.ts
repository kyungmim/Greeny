import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { fetchAccessToken } from './app/api/fetch/userFetch';
import { RefreshTokenRes } from './types/response';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { login } from './app/api/actions/authAction';
import { UserLoginForm } from './types/user';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const resJson = await login(credentials as UserLoginForm);

        if (resJson.ok) {
          const user = resJson.item;
          return {
            id: String(user._id),
            type: user.type,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            image: user.image && SERVER + user.image,
            accessToken: user.token!.accessToken,
            refreshToken: user.token!.refreshToken,
          };
        } else {
          throw new CredentialsSignin(resJson.message, { cause: resJson });
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
    // maxAge: 0,
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
      } else {
      }

      // 세션 없데이트
      if (trigger === 'update' && session) {
        token.name = session.name;
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
