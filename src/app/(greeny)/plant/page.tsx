import Image from 'next/image';
import styles from './MyPlant.module.scss';
import Link from 'next/link';
import { PlantRes } from '@/types/plant';
import { auth } from '@/auth';
import { differenceInDays } from 'date-fns';
const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export default async function MyPlant() {
  const session = await auth();

  if (!session) return '로그인 만료';
  const res = await fetch(`${SERVER}/seller/products`, {
    headers: {
      'client-id': `${DBNAME}`,
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  const resJson = await res.json();
  const data = resJson && resJson.item;

  const myPlantList = data?.map((item: PlantRes) => {
    const currentDay: Date | null = item.adoptionDate;
    const toDay: Date = new Date();
    const diffDays = currentDay && differenceInDays(toDay, currentDay);

    return (
      <Link href={`/plant/${item._id}`} className={styles.contents_item} key={item._id}>
        <div className={styles.item_cover}>
          <Image src={`${item.mainImages!.length > 0 ? `${SERVER}${item.mainImages![0].path}` : ''}`} alt="식물 사진" fill sizes="100%" />
        </div>

        <div className={styles.item_info}>
          <h3>{item.name}</h3>
          <p>{item.name}</p>

          {currentDay && <span>{diffDays} 일째</span>}
        </div>
      </Link>
    );
  });

  return (
    <div className={styles.plant_wrapper}>
      <div className={styles.contents_head}>
        <h2>My Plant</h2>

        <div className={styles.btn_box}>
          <Link href="/plant/new" className={styles.button_fill}>
            <span className="hidden">추가</span>
          </Link>
        </div>
      </div>

      <div className={styles.contents_main}>{myPlantList}</div>
    </div>
  );
}
