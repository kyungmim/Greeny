'use client';
import styles from './MyPlantDetail.module.scss';
import { useState } from 'react';
import { PlantRes } from '@/types/plant';
import PlantInfo from './PlantInfo';
import PlantDiray from './PlantDiary';

export default function MyPlantDetail({ item }: { item: PlantRes }) {
  const [tabMenun, setTabMenu] = useState(true);
  const handleTab = (tabClick: string) => {
    if (tabClick === 'info') {
      return setTabMenu(true);
    } else if (tabClick === 'diary') {
      return setTabMenu(false);
    }
  };

  return (
    <>
      <div className={styles.plant_tabMenu}>
        <button className={`${styles.plant_info} ${tabMenun ? styles.is_active : ''}`} onClick={() => handleTab('info')}>
          <span className="hidden">정보</span>
        </button>
        <button className={`${styles.plant_diary} ${!tabMenun ? styles.is_active : ''}`} onClick={() => handleTab('diary')}>
          <span className="hidden">일기</span>
        </button>
      </div>
      {tabMenun ? <PlantInfo item={item} /> : <PlantDiray id={item._id} name={item.name} />}
    </>
  );
}
