'use client';
import Button from '@/components/button/Button';
import styles from './MyPlantDetail.module.scss';
import { followPlant } from '@/app/api/actions/followAction';

export default function FollowButton({ id }: { id: string }) {
  return (
    <Button type="button" btnSize="lg" bgColor="fill" radiusStyle="round" onClick={() => followPlant(id)}>
      식물 친구 추가
    </Button>
  );
}
