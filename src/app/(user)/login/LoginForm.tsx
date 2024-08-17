'use client';
import styles from './Login.module.scss';
import git from '@images/Social_Github.svg';
import google from '@images/Social_Google.svg';
import kakao from '@images/Social_KaKao.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { UserLoginForm } from '@/types/user';
import Button from '@/components/button/Button';
import { useRouter } from 'next/navigation';
import { signInWithCredentials } from '@/app/api/actions/authAction';
import { signOut } from 'next-auth/react';

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<UserLoginForm>();
  const onSubmit = async (data: UserLoginForm) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      await signInWithCredentials(formData);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        action={() => {
          signOut();
        }}
      >
        <button type="submit">로그아웃</button>
      </form>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.input_container}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력하세요"
            {...register('email', {
              required: '이메일을 입력하세요.',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '이메일 형식이 올바르지 않습니다.',
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className={styles.input_container}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            {...register('password', {
              required: '비밀번호를 입력하세요.',
              minLength: {
                value: 8,
                message: '비밀번호 형식이 올바르지 않습니다.',
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <p className={styles.signupText}>
          처음 방문이신가요? <Link href={'/signup'}>회원가입</Link>
        </p>

        <Button type="submit" btnSize="lg" bgColor="fill">
          로그인
        </Button>
        <div className={styles.socail}>
          <p>SNS계정으로 로그인</p>

          <div className={styles.socail_list}>
            <button type="button">
              <Image src={google} alt="구글" width={40} />
            </button>
            <button type="button">
              <Image src={kakao} alt="카카오" width={40} />
            </button>
            <button type="button">
              <Image src={git} alt="깃허브" width={40} />
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
