'use client';
import styles from './MyPlantDetail.module.scss';
import './Calendar.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PlantDetailRes } from '@/types/plant';
import { format } from 'date-fns';
import scheduleIcon from '@images/CaleandarIcon.svg';
import { useSession } from 'next-auth/react';
const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export default function PlantDiray({ productId, sellerId, name }: { productId: number; sellerId: number; name: string }) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const selectDay = format(currentDate, 'yyyy-MM-dd');
  const [selectData, setSelectData] = useState<PlantDetailRes[] | undefined>();
  const [scheduleData, setSscheduleData] = useState<PlantDetailRes[] | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const session = useSession();

  const fetchPlantsDiary = async (productId: number | undefined, selectDay: string, fetchAll: boolean) => {
    let url = `${SERVER}/posts/?type=diary`;

    if (fetchAll) {
      url += `&custom={"product_id":${productId}}`;
    } else {
      url += `&custom={"extra.actionDate":"${selectDay}","product_id":${productId}}`;
    }
    const res = await fetch(url, {
      headers: {
        'client-id': `${DBNAME}`,
      },
    });
    const resJson = await res.json();

    return resJson.item;
  };

  useEffect(() => {
    const fetchData = async () => {
      const scheduleItems = await fetchPlantsDiary(productId, selectDay, true);
      setSscheduleData(scheduleItems);
      const todayItems = await fetchPlantsDiary(productId, selectDay, false);
      setSelectData(todayItems);
      setIsLoaded(true);
    };

    fetchData();
  }, [productId, currentDate.getMonth()]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded) {
        const dateItems = await fetchPlantsDiary(productId, selectDay, false);
        setSelectData(dateItems);
      }
    };

    fetchData();
  }, [currentDate]);

  //다이어리
  const diaryList =
    selectData && selectData.length > 0 ? (
      selectData.map((item: PlantDetailRes) => (
        <li key={item._id}>
          <Link href={`/story/diaries/${item._id}`} className={styles.diary_item}>
            <div className={styles.item_head}>
              <div className={styles.item_info}>
                <span>식물 상태 :</span>
                <p>{item.extra.plantState}</p>
              </div>
              <div className={styles.item_info}>
                <span>반려 식물을 위한 활동 :</span>
                <p>{item.extra.action}</p>
              </div>
              <div className={styles.item_info}>
                <span>활동 날짜 :</span>
                <p>{item.extra.actionDate}</p>
              </div>
            </div>

            <div className={styles.item_cover}>
              <Image src={item.image?.length > 0 ? `${SERVER}${item.image[0].path}` : ''} alt="식물 사진" fill sizes="100%" />
            </div>
            <div className={styles.item_desc}>
              <pre>{item.content}</pre>
            </div>
          </Link>
        </li>
      ))
    ) : (
      <li className={styles.diaryNull}>
        <span>{name}</span>이(가) 몰래 메시지를 남겼어요! <br /> &quot;나 오늘 잘 자랐어?&quot;
      </li>
    );

  //캘린더 일정 표시
  const renderSchedule = ({ date }: { date: Date }) => {
    const scheduleDate = format(date, 'yyyy-MM-dd');
    const diaryEntry = scheduleData?.find((item) => item.extra.actionDate === scheduleDate);

    if (diaryEntry) {
      return (
        <div className="scheduleIcon">
          <Image src={scheduleIcon} alt="식물 사진" fill sizes="100%" />
        </div>
      );
    }
  };

  return (
    <div className={styles.layout_wrapper}>
      <div className={styles.diary_head}>
        <h3>식물 일기</h3>
        {Number(session.data?.user?.id) === sellerId && (
          <Link href={`/plant/${productId}/diaryNew`} className={styles.diary_add}>
            <span className="hidden">식물 일기 추가</span>
          </Link>
        )}
      </div>
      <Calendar
        locale="ko-KR"
        formatDay={(_, date: Date) => format(date, 'd')}
        value={currentDate}
        onChange={(date) => setCurrentDate(date as Date)}
        tileContent={renderSchedule}
        calendarType="gregory"
      />

      <ul className={styles.diary_list}>{diaryList}</ul>
    </div>
  );
}
