import MyPlantAddForm from './MyPlantAddForm';
import styles from './MyPlantNew.module.scss';

export default function MyPlantNew() {
  return (
    <div className={styles.plantNew_wrapper}>
      <MyPlantAddForm />
    </div>
  );
}
