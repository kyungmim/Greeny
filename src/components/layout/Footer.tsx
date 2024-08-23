'use client';
import Link from 'next/link';
import styles from './Footer.module.scss';
import Image from 'next/image';
import community_nor from '@images/PlantCommunity_nor.svg';
import community_sel from '@images/PlantCommunity_sel.svg';
import mypage_nor from '@images/Mypage_nor.svg';
import mypage_sel from '@images/Mypage_sel.svg';
import diary_nor from '@images/Diary_nor.svg';
import diary_sel from '@images/Diary_sel.svg';
import home_nor from '@images/Home_nor.svg';
import home_sel from '@images/Home_sel.svg';
import book_nor from '@images/PlantBook_nor.svg';
import book_sel from '@images/PlantBook_sel.svg';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className={styles.layout_wrapper}>
      <ul className={styles.nav}>
        <li>
          <Link href="/books" className={styles.nav_item}>
            {pathname.includes('/book') ? <Image src={book_sel} alt="식물 백과" width={16} height={16} /> : <Image src={book_nor} alt="식물 백과" width={16} height={16} />}

            <p className={`${pathname.includes('/books') ? `${styles.is_active}` : ''}`}>식물 백과</p>
          </Link>
        </li>
        <li>
          <Link href="/story" className={styles.nav_item}>
            {pathname.includes('/story') ? <Image src={community_sel} alt="식물 이야기" width={16} height={16} /> : <Image src={community_nor} alt="식물 이야기" width={16} height={16} />}
            <p className={`${pathname.includes('/story') ? `${styles.is_active}` : ''}`}>식물 이야기</p>
          </Link>
        </li>
        <li>
          <Link href="/" className={styles.nav_item}>
            {pathname === '/' ? <Image src={home_sel} alt="홈" width={16} height={16} /> : <Image src={home_nor} alt="홈" width={16} height={16} />}

            <p className={`${pathname === '/' ? `${styles.is_active}` : ''}`}>홈</p>
          </Link>
        </li>
        <li>
          <Link href="/plant" className={styles.nav_item}>
            {pathname.includes('/plant') ? <Image src={diary_sel} alt="나의 식물" width={16} height={16} /> : <Image src={diary_nor} alt="나의 식물" width={16} height={16} />}

            <p className={`${pathname.includes('/plant') ? `${styles.is_active}` : ''}`}>나의 식물</p>
          </Link>
        </li>
        <li>
          <Link href="/profile" className={styles.nav_item}>
            {pathname.includes('/profile') ? <Image src={mypage_sel} alt="마이페이지" width={16} height={16} /> : <Image src={mypage_nor} alt="마이페이지" width={16} height={16} />}
            <p className={`${pathname.includes('/profile') ? `${styles.is_active}` : ''}`}>마이페이지</p>
          </Link>
        </li>
      </ul>
    </footer>
  );
}
