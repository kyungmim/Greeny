'use server';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
export async function signInWithCredentials(formData: FormData) {
  try {
    console.log('formData', formData);
    const result = await signIn('credentials', {
      email: formData.get('email') || '',
      password: formData.get('password') || '',
      redirect: false,
    });
    console.log('result', result);
  } catch (err) {
    console.error(err);
  }

  console.log('로그인 성공이다 이자식아');
  redirect('/');
}

// export async function signInWithGithub(formData: FormData) {
//   await signIn('github', { redirectTo: '/' });
// }
// export async function signInWithGoogle(formData: FormData) {
//   await signIn('google', { redirectTo: '/' });
// }
