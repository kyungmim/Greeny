'use client';
import styles from './Login.module.scss';
import git from '@images/Social_Github.svg';
import google from '@images/Social_Google.svg';
import kakao from '@images/Social_KaKao.svg';
import Image from 'next/image';
import Link from 'next/link';
import { signInWithCredentials } from '@/app/api/actions/authAction';
import { signOut } from 'next-auth/react';

export default function LoginForm() {
  return (
    <>
      <form action={() => signOut()}>
        <button type="submit">로그아웃</button>
      </form>
      <form action={signInWithCredentials}>
        <div className={styles.input_container}>
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" name="email" placeholder="이메일을 입력하세요" />
          <p>이메일 형식이 올바르지 않습니다.</p>
        </div>

        <div className={styles.input_container}>
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요" />
          <p>비밀번호 형식이 올바르지 않습니다.</p>
        </div>

        <p className={styles.signupText}>
          처음 방문이신가요? <Link href={'/signup'}>회원가입</Link>
        </p>

        <button type="submit" className={styles.button} formAction={signInWithCredentials}>
          로그인
        </button>
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
