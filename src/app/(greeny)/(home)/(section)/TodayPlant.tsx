'use client';
import styles from '../Home.module.scss';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import plant from '@/data/plantList.json';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function TodayPlant() {
  const [plantInfo, setPlantInfo] = useState<{ plantImg: string; plantName: string }[]>();

  const randomPlantImgUrl: { plantImg: string; plantName: string }[] = (() => {
    const ImgUrl = [];
    for (let i = 1; i <= 5; i++) {
      const randomNum = Math.floor(Math.random() * 216);
      ImgUrl.push({ plantImg: plant[randomNum].rtnFileUrl, plantName: plant[randomNum].cntntsSj });
    }
    return ImgUrl;
  })();

  useEffect(() => {
    return setPlantInfo(randomPlantImgUrl);
  }, []);
  return (
    <Swiper className={styles.swiperList} slidesPerView={1.5} spaceBetween={10}>
      <SwiperSlide className={styles.swiper_item}>
        <div className={styles.swiper_cover}>{plantInfo && <Image src={plantInfo[0].plantImg} alt="식물 사진" fill sizes="100%" />}</div>
        <p>{plantInfo && plantInfo[0].plantName}</p>
      </SwiperSlide>
      <SwiperSlide className={styles.swiper_item}>
        <div className={styles.swiper_cover}>{plantInfo && <Image src={plantInfo[1].plantImg} alt="식물 사진" fill sizes="100%" />}</div>
        <p>{plantInfo && plantInfo[1].plantName}</p>
      </SwiperSlide>
      <SwiperSlide className={styles.swiper_item}>
        <div className={styles.swiper_cover}>{plantInfo && <Image src={plantInfo[2].plantImg} alt="식물 사진" fill sizes="100%" />}</div>
        <p>{plantInfo && plantInfo[2].plantName}</p>
      </SwiperSlide>
      <SwiperSlide className={styles.swiper_item}>
        <div className={styles.swiper_cover}>{plantInfo && <Image src={plantInfo[3].plantImg} alt="식물 사진" fill sizes="100%" />}</div>
        <p>{plantInfo && plantInfo[3].plantName}</p>
      </SwiperSlide>
      <SwiperSlide className={styles.swiper_item}>
        <div className={styles.swiper_cover}>{plantInfo && <Image src={plantInfo[4].plantImg} alt="식물 사진" fill sizes="100%" />}</div>
        <p>{plantInfo && plantInfo[4].plantName}</p>
      </SwiperSlide>
    </Swiper>
  );
}
