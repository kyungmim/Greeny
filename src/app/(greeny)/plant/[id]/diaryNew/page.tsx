import DiaryNewForm from './DiaryNewForm';
import styles from './MyPlantDiaryNew.module.scss';

export default function MyPlantDiaryNew({ params }: { params: { id: string } }) {
  return (
    <div className={styles.diaryAdd_wrapper}>
      <DiaryNewForm id={params.id} />
    </div>
  );
}
