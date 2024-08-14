import styles from './Login.module.scss';
import Logo from '@images/Logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import LoginForm from './LoginForm';

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
