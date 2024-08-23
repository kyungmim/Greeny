// 서버 액션 정의
'use server';
import { signIn } from '@/auth';
import { ApiResWithValidation, CoreErrorRes, SingleItem } from '@/types/response';
import { UserData, UserLoginForm } from '@/types/user';
import { redirect } from 'next/navigation';
const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export async function signInWithCredentials(formData: UserLoginForm): Promise<ApiResWithValidation<SingleItem<UserData>, UserLoginForm>> {
  try {
    const result = await signIn('credentials', { ...formData, redirect: false, callbackUrl: '/' });
    console.log(result);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return err.cause as CoreErrorRes;
    }
  }
  redirect('/');
}

export async function login(userObj: UserLoginForm): Promise<ApiResWithValidation<SingleItem<UserData>, UserLoginForm>> {
  const res = await fetch(`${SERVER}/users/login`, {
    method: 'POST',
    headers: {
      'client-id': `${DBNAME}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(userObj),
  });
  return res.json();
}

export async function signInWithGoogle(formData: FormData) {
  await signIn('google', { redirectTo: '/' });
}

export async function signInWithGithub(formData: FormData) {
  await signIn('github', { redirectTo: '/' });
}
