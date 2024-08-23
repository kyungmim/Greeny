'use client';
import { PlantBookmark } from '@/types/bookmark';
import styles from './MyPlantDetail.module.scss';
import { followPlant, unFollowPlant } from '@/app/api/actions/followAction';

export default function FollowButton({ id, bookmarkData }: { id: string; bookmarkData: PlantBookmark[] }) {
  const isFollowed = bookmarkData.some((num) => Number(id) === num.product._id);
  const LikeId = bookmarkData.find((num) => Number(id) === num.product._id);

  return (
    <>
      <button type="button" className={isFollowed ? styles.unFollowBtn : styles.followBtn} onClick={() => (isFollowed ? unFollowPlant(LikeId?._id) : followPlant(id))}>
        {isFollowed ? '언팔로우' : '팔로우'}
      </button>
    </>
  );
}
