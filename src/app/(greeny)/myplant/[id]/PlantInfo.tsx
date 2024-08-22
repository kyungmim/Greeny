'use client';
import styles from './MyPlantDetail.module.scss';
import { PlantRes } from '@/types/plant';
import { useState } from 'react';
import { plantsDelete } from '@/app/api/actions/plantAction';
import { useRouter } from 'next/navigation';

export default function PlantInfo({ item }: { item: PlantRes }) {
  const [menu, setMenu] = useState(false);
  const router = useRouter();

  const handleMenu = () => {
    setMenu(!menu);
  };

  const handleDelete = () => {
    if (confirm(`"정말 떠나보낼 거예요?" \n${item.name}이(가) 마지막으로 잎사귀를 흔들고 있어요... 🍃`) == true) {
      plantsDelete(item._id);
      router.push('/myplant');
    }
  };

  return (
    <div className={styles.layout_wrapper}>
      <div className={styles.plant_gardening}>
        <div className={styles.plant_head}>
          <h3>가드닝 정보</h3>
          <button className={styles.subMeun} onClick={handleMenu}>
            <span className="hidden">메뉴</span>
          </button>
          {menu && (
            <div className={styles.subMenuBox}>
              <button type="button" className={styles.subMenuItem}>
                식물 수정
              </button>
              <hr />
              <button type="button" onClick={handleDelete} className={`${styles.subMenuItem} ${styles.delete}`}>
                식물 삭제
              </button>
            </div>
          )}
        </div>
        <ul>
          <li>
            <span>온도</span>
            <p>{item.grwhTp}</p>
          </li>
          <li>
            <span>습도</span>
            <p>{item.humidity}</p>
          </li>
          <li>
            <span>물주기</span>
            <p>{item.waterCycle}일에 한번씩</p>
          </li>
          <li>
            <span>일조량</span>
            <p>{item.light}</p>
          </li>
        </ul>
      </div>
      <div className={styles.plant_tips}>
        <h3>특징</h3>
        <pre>{item.content}</pre>
      </div>
    </div>
  );
}
