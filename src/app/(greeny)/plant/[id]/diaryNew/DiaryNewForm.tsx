'use client';
import Image from 'next/image';
import styles from './MyPlantDiaryNew.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { DiaryForm } from '@/types/post';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import photoAdd from '@images/PhotoAddIcon.svg';
import photoDelete from '@images/PhotoDeleteIcon.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Button from '@/components/button/Button';
import { DiaryNew } from '@/app/api/actions/plantAction';
import { useRouter } from 'next/navigation';

export default function DiaryNewForm({ id }: { id: string }): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<DiaryForm>();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const images = watch('attach');

  useEffect(() => {
    if (images && images.length > 0) {
      if (images.length > 5) {
        alert('이미지는 최대 5개 등록 가능합니다.');
        return;
      }
      const files = Array.from(images);
      const previews: string[] = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          previews.push(reader.result as string);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [images]);

  const handleDeleteImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const imageList = imagePreviews.map((preview, i) => (
    <SwiperSlide key={i} className={styles.swiperItem}>
      <div className={styles.swiper_cover}>
        <Image src={preview} alt={`preview-${i}`} fill sizes="100%" />
      </div>
      <button type="button" className={styles.deleteIcon} onClick={() => handleDeleteImage(i)}>
        <Image src={photoDelete} alt={`preview-${i}`} width={24} height={24} />
      </button>
    </SwiperSlide>
  ));

  const onNewDiary = async (formData: DiaryForm) => {
    try {
      const plantForm = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'attach') {
          plantForm.append(key, value as string);
        }
      });
      if (formData.attach) {
        Array.from(formData.attach).forEach((file) => {
          plantForm.append('attach', file);
        });
      }

      const res = await DiaryNew(plantForm, id);
      // console.log(res);
      if (res.ok) {
        alert('식물 다이어리가 새잎을 틔웠어요! 🌿');
        router.push(`/plant/${id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onNewDiary)}>
      <h1>식물 일기 등록</h1>
      <div className={styles.file_container}>
        <div className={styles.file_head}>
          <h3>식물 이미지</h3>
          <p>사진 {imagePreviews ? imagePreviews.length : ''}개 선택</p>
        </div>
        <div className={styles.photo_Box}>
          <label htmlFor="attach" className={styles.photoAdd}>
            <div className={styles.photo_cover}>
              <Image src={photoAdd} alt="프로필 사진 선택" fill sizes="100%" priority />
            </div>
            <input type="file" id="attach" multiple {...register('attach')} />
          </label>

          <Swiper className={styles.swiperList} slidesPerView={2} spaceBetween={5}>
            {imageList}
          </Swiper>
        </div>
        <p>업로드 가능한 사진의 최대 개수는 5장입니다 </p>
      </div>

      <div className={styles.input_container}>
        <label htmlFor="plantState">
          식물 상태<span>*</span>
        </label>

        <div className={styles.selectBox}>
          <select className={styles.select} defaultValue="placeholder" {...register('plantState')}>
            <option disabled value="placeholder">
              식물의 상태를 선택해주세요.
            </option>
            <option value="좋음">좋음</option>
            <option value="새싹">새싹</option>
            <option value="개화">개화</option>
            <option value="아픔">아픔</option>
            <option value="죽음">죽음</option>
          </select>
        </div>
        {errors.plantState && <p>{errors.plantState.message}</p>}
      </div>
      <div className={styles.input_container}>
        <label htmlFor="action">
          반려식물을 위한 활동<span>*</span>
        </label>

        <div className={styles.selectBox}>
          <select className={styles.select} defaultValue="placeholder" {...register('action')}>
            <option disabled value="placeholder">
              활동을 선택해주세요.
            </option>
            <option value="물주기">물주기</option>
            <option value="햇빛">햇빛</option>
            <option value="분갈이">분갈이</option>
            <option value="영양">영양</option>
            <option value="가지">가지</option>
            <option value="관찰">관찰</option>
          </select>
        </div>
        {errors.action && <p>{errors.action.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="actionDate">
          활동 날짜<span>*</span>
        </label>

        <Controller
          control={control}
          name="actionDate"
          rules={{ required: '활동 날짜를 선택해주세요.' }}
          render={({ field: { onChange } }) => (
            <DatePicker
              selected={selectedDate}
              dateFormat="yyyy.MM.dd"
              onChange={(date) => {
                setSelectedDate(date);
                onChange(date ? format(date, 'yyyy-MM-dd') : '');
              }}
            />
          )}
        />
        {errors.actionDate && <p>{errors.actionDate.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="title">
          제목<span>*</span>
        </label>
        <input type="text" id="title" placeholder="제목을 입력해주세요." {...register('title')} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="content">
          내용<span>*</span>
        </label>
        <textarea id="content" placeholder="물주기를 선택해주세요." {...register('content')} />
        {errors.content && <p>{errors.content.message}</p>}
      </div>

      <Button type="submit" bgColor="fill" btnSize="lg">
        일기 등록
      </Button>
    </form>
  );
}
