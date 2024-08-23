'use client';
import styles from './MyPlantNew.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@/components/button/Button';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import photoAdd from '@images/PhotoAddIcon.svg';
import plantData from '@/app/data/plantList';
import { PlantForm } from '@/types/plant';
import { format } from 'date-fns';
import { plantNew } from '@/app/api/actions/plantAction';

export default function MyPlantAddForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [drop, setDrop] = useState(false);
  const [plantName, setPlantName] = useState('식물을 선택해주세요.');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<PlantForm>();

  //식물 사진 미리보기
  const [imagePreview, setImagePreview] = useState<string>('');
  const image = watch('attach');

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  //식물 'name'
  const selectedPlantName = watch('scientificName');
  const selectedPlant = plantData.find((p) => p?.cntntsSj === plantName);

  useEffect(() => {
    if (selectedPlant) {
      setValue('light', selectedPlant.lighttdemanddoCodeNm || '');
      setValue('grwhTp', selectedPlant.grwhTpCodeNm || '');
      setValue('humidity', selectedPlant.hdCodeNm || '');
      setValue('waterCycle', Number(selectedPlant.waterCycleDay) || 0);
    }
  }, [selectedPlantName, selectedPlant, setValue]);

  //드롭다운
  const handledrop = () => {
    setDrop(!drop);
  };

  const plantOptions = plantData.map((plant) => (
    <li
      key={plant.cntntsNo}
      onClick={() => {
        setPlantName(plant.cntntsSj);
        setValue('scientificName', plant.cntntsSj);
        setDrop(false);
      }}
      className={styles.dropItem}
    >
      {plant.cntntsSj}
    </li>
  ));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDrop(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //데이터 패치
  const onAddPlant = async (formData: PlantForm) => {
    try {
      const plantForm = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'attach') {
          plantForm.append(key, value as string);
        }
      });
      if (formData.attach) {
        plantForm.append('attach', formData.attach[0]);
      }

      const res = await plantNew(plantForm);
      // console.log(res);
      if (res.ok) {
        alert(`${res.item.name}이(가) 우리 가족에 합류했어요! `);
        router.replace('/plant');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onAddPlant)}>
      <h1>나의 식물 등록</h1>

      <div className={styles.file_container}>
        <h3>
          식물 이미지<span>*</span>
        </h3>
        <label htmlFor="attach" className={styles.photoAdd}>
          <div className={styles.photo_cover}>
            {imagePreview ? <Image src={imagePreview} alt="프로필 사진 선택" fill sizes="100%" priority /> : <Image src={photoAdd} alt="프로필 사진 선택" fill sizes="100%" priority />}
            <input type="file" id="attach" {...register('attach')} />
          </div>
        </label>
      </div>

      <div className={styles.input_container}>
        <label htmlFor="scientificName">
          식물<span>*</span>
        </label>
        <div className={styles.selectBox} ref={dropdownRef} onClick={handledrop}>
          {plantName}

          {drop ? <ul className={styles.select}>{plantOptions}</ul> : ''}
        </div>
        <input type="hidden" {...register('scientificName')} value={plantName} />
        {errors.scientificName && <p>{errors.scientificName.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="info">가드닝 정보</label>
        <div className={styles.infoBox}>
          <div className={styles.infoItem}>
            <div className={styles.infoTit}>
              <h4>습도</h4>
              <span>|</span>
            </div>
            <input readOnly className={styles.readInput} type="text" {...register('humidity')} />
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoTit}>
              <h4>온도</h4>
              <span>|</span>
            </div>
            <input readOnly className={styles.readInput} type="text" {...register('grwhTp')} />
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoTit}>
              <h4>일조량</h4>
              <span>|</span>
            </div>
            <input readOnly className={styles.readInput} type="text" {...register('light')} />
          </div>
        </div>
      </div>

      <div className={styles.input_container}>
        <label htmlFor="nickName">
          식물 애칭<span>*</span>
        </label>
        <input
          type="text"
          id="nickName"
          placeholder="식물 애칭을 입력하세요."
          {...register('name', {
            required: '식물 애칭을 입력하세요.',
            minLength: {
              value: 2,
              message: '애칭을 2글자 이상 입력하세요.',
            },
          })}
        />
        {errors.name && <p>{errors.name?.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="adoptionDate">
          식물 입양일<span>*</span>
        </label>

        <Controller
          control={control}
          name="adoptionDate"
          rules={{ required: '입양 날짜를 선택해주세요.' }}
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

        {errors.adoptionDate && <p>{errors.adoptionDate.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="waterCycle">
          물주기<span>*</span>
        </label>
        <div className={styles.sub_container}>
          <input
            type="number"
            id="waterCycle"
            placeholder="물주기를 선택해주세요."
            {...register('waterCycle', {
              required: '물주기를 입력하세요.',
              pattern: {
                value: /^[0-9]*$/,
                message: '숫자만 입력 가능합니다.',
              },
            })}
          />
          <span>일에 한번씩</span>
        </div>
        {errors.waterCycle && <p>{errors.waterCycle.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="content">특징</label>
        <textarea
          id="content"
          placeholder="식물의 특징을 적어주세요."
          {...register('content', {
            required: '식물의 특징을 적어주세요.',
            minLength: {
              value: 10,
              message: '특징을 10글자 이상 입력하세요.',
            },
          })}
        />
        {errors.content && <p>{errors.content.message}</p>}
      </div>

      <Button type="submit" bgColor="fill" btnSize="lg">
        식물 등록
      </Button>
    </form>
  );
}
