import { fetchPlantsDetail } from '@/app/api/fetch/plantFetch';
import styles from './MyPlantEdit.module.scss';
import MyPlantEditForm from './MyPlantEditForm';
import { PlantRes } from '@/types/plant';

export default function MyPlantDiaryEdit({ params }: { params: { id: string } }) {
  const item = fetchPlantsDetail<PlantRes>(params.id);

  return (
    <div className={styles.diaryAdd_wrapper}>
      <MyPlantEditForm id={params.id} />
    </div>
  );
}
