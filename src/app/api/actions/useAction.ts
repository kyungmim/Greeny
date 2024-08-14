'use server';

import { ApiResWithValidation, SingleItem } from '@/types/response';
import { UserData, UserForm } from '@/types/user';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export async function signup(formData: UserForm) {
  // 이미지 업로드
  if (formData.attach !== undefined && formData.attach.length > 0) {
    const body = new FormData();
    body.append('attach', formData.attach[0]);

    const fileRes = await fetch(`${SERVER}/files`, {
      method: 'POST',
      body,
    });

    const fileJSON = await fileRes.json();

    if (!fileJSON.ok) throw new Error('파일 업로드 실패!');

    formData.profileImage = fileJSON.item[0].path;
  }

  delete formData.attach;
  formData.type = 'seller';

  const res = await fetch(`${SERVER}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const resData: ApiResWithValidation<SingleItem<UserData>, UserForm> = await res.json();

  return resData;
}
