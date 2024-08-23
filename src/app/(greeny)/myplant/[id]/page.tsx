import Image from 'next/image';
import styles from './MyPlantDetail.module.scss';
import { fetchPlantsDetail } from '@/app/api/fetch/plantFetch';
import { PlantRes } from '@/types/plant';
import { differenceInDays } from 'date-fns';
import MyPlantDetail from './PlantDetail';
import { auth } from '@/auth';
import { followPlant } from '@/app/api/actions/followAction';
import FollowBtn from '../../story/diaries/[id]/FollowBtn';
import FollowButton from './FollowButton';
const SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export default async function MyPlantItem({ params }: { params: { id: string } }) {
  const session = await auth();
  const item = await fetchPlantsDetail<PlantRes>(params.id);

  const currentDay = item.adoptionDate;
  const toDay = new Date();
  const diffDays = differenceInDays(toDay, currentDay);

  return (
    <div className={styles.plantDetail_wrapper}>
      <div className={styles.plant_photo}>
        <Image src={`${item.mainImages!.length > 0 ? `${SERVER}${item.mainImages![0].path}` : ''}`} alt="식물 사진" fill sizes="100%" />
      </div>

      <div className={styles.plant_name}>
        <h2>{item.name}</h2>
        <span>{item.scientificName}</span>

        {session?.user?.id == item.seller_id ? (
          <p className={styles.plant_with}>
            `{item.name}`와 함께한지 {diffDays}일째에요!
          </p>
        ) : (
          <FollowButton id={params.id} />
        )}
      </div>
      <MyPlantDetail item={item} />
    </div>
  );
}
