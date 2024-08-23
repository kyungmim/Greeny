import styles from './Login.module.scss';
import Logo from '@images/Logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
  openGraph: {
    title: 'login',
    description: '로그인 페이지',
    url: '/login',
  },
};

export default function Login() {
  return (
    <div className={styles.login_wrapper}>
      <Link href="/">
        <Image className={styles.logo} src={Logo} alt="greeny" width={150} />
      </Link>
      <LoginForm />
    </div>
  );
}
