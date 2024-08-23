'use client';
import styles from './Edit.module.scss';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserInfo, UserForm } from '@/types/user';
import Button from '@/components/button/Button';
import photoAdd from '@images/PhotoAddIcon.svg';
import { editUser } from '@/app/api/actions/userAction';
import { signOut } from 'next-auth/react';

export default function EditForm({ user }: { user: UserInfo }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<UserForm>();

  //프로필 미리보기
  const [imagePreview, setImagePreview] = useState<string>();
  const image = watch('attach');
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  const onEdit = async (formData: UserForm) => {
    const userForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'attach') {
        userForm.append(key, value as string);
      }
    });
    if (formData.attach) {
      userForm.append('attach', formData.attach[0]);
    }

    const resData = await editUser(userForm);
    if (resData.ok) {
      alert(`프로필 수정이 완료되었습니다.\n재로그인 해주세요.`);
      signOut({
        callbackUrl: '/',
      });
    } else {
      if ('errors' in resData) {
        resData.errors.forEach((error) => setError(error.path, { message: error.msg }));
      } else if (resData.message) {
        alert(resData.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onEdit)}>
      <h2>프로필 수정</h2>

      <div className={styles.file_container}>
        <h3>프로필 이미지</h3>
        <label htmlFor="attach" className={styles.photoAdd}>
          <div className={styles.photo_cover}>
            {imagePreview ? (
              <Image src={imagePreview} alt="프로필 사진 선택" fill sizes="100%" priority />
            ) : user.image ? (
              <Image src={process.env.NEXT_PUBLIC_API_SERVER + '/' + user.image} alt="프로필 사진 선택" fill sizes="100%" priority />
            ) : (
              <Image src={photoAdd} alt="프로필 사진 선택" fill sizes="100%" priority />
            )}
            <input type="file" id="attach" {...register('attach')} />
          </div>
        </label>
      </div>

      <div className={styles.input_container}>
        <label htmlFor="name">
          이름<span>*</span>
        </label>
        <input
          type="text"
          id="name"
          placeholder="이름을 입력하세요."
          defaultValue={user.name}
          {...register('name', {
            required: '이름을 입력하세요.',
            minLength: {
              value: 2,
              message: '이름을 2글자 이상 입력하세요.',
            },
          })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="password">
          비밀번호<span>*</span>
        </label>
        <input
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요."
          {...register('password', {
            required: '비밀번호를 입력하세요.',
            minLength: {
              value: 8,
              message: '비밀번호 형식이 올바르지 않습니다.',
            },
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="phone">전화번호</label>
        <input
          type="text"
          id="phone"
          placeholder="전화번호를 입력하세요."
          defaultValue={user.phone}
          {...register('phone', {
            required: '전화번호를 입력하세요',
            minLength: {
              value: 10,
              message: '전화번호를 10자리 이상 입력하세요.',
            },
          })}
        />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>

      <div className={styles.input_container}>
        <label htmlFor="address">주소</label>
        <input
          type="text"
          id="address"
          placeholder="주소를 입력하세요."
          defaultValue={user.address}
          {...register('address', {
            required: '주소를 입력하세요.',
            minLength: {
              value: 10,
              message: '주소를 올바르게 입력하세요.',
            },
          })}
        />
        {errors.address && <p>{errors.address.message}</p>}
      </div>

      <Button bgColor="fill" btnSize="lg" type="submit">
        저장하기
      </Button>
    </form>
  );
}
