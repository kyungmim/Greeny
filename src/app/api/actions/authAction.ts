// 서버 액션 정의
'use server';
import { signIn } from '@/auth';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

// email/password 로그인
export async function signInWithCredentials(formData: FormData) {
  try {
    const result = await signIn('credentials', {
      email: formData.get('email') || '',
      password: formData.get('password') || '',
      redirect: false,
    });

    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

export async function signInWithGoogle(formData: FormData) {
  await signIn('google', { redirectTo: '/' });
}

export async function signInWithGithub(formData: FormData) {
  await signIn('github', { redirectTo: '/' });
}
