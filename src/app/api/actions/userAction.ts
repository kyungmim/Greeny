// 서버 액션 정의
'use server';

import { auth } from '@/auth';
import { FileRes } from '@/types/image';
import { ApiResWithValidation, MultiItem, SingleItem } from '@/types/response';
import { UserData, UserForm } from '@/types/user';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export async function signup(formData: FormData): Promise<ApiResWithValidation<SingleItem<UserData>, UserForm>> {
  const userObj = {
    type: formData.get('type') || 'seller',
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    image: '',
  };

  const attach = formData.get('attach') as File;

  if (attach?.size > 0) {
    const fileRes = await fetch(`${SERVER}/files`, {
      method: 'POST',
      headers: {
        'client-id': `${DBNAME}`,
      },
      body: formData,
    });

    if (!fileRes.ok) {
      throw new Error('파일 업로드 실패');
    }
    const fileData: MultiItem<FileRes> = await fileRes.json();

    userObj.image = fileData.item[0].path;
  }

  const res = await fetch(`${SERVER}/users`, {
    method: 'POST',
    headers: {
      'client-id': `${DBNAME}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userObj),
  });

  return res.json();
}

export async function editUser(formData: FormData): Promise<ApiResWithValidation<SingleItem<UserData>, UserForm>> {
  const session = await auth();

  const userObj = {
    type: formData.get('type') || 'seller',
    name: formData.get('name'),
    // email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    image: '',
  };
  console.log('🚀 ~ editUser ~ userObj:', userObj);

  const attach = formData.get('attach') as File;

  if (attach?.size > 0) {
    const fileRes = await fetch(`${SERVER}/files`, {
      method: 'POST',
      headers: {
        'client-id': `${DBNAME}`,
      },
      body: formData,
    });

    if (!fileRes.ok) {
      throw new Error('파일 업로드 실패');
    }
    const fileData: MultiItem<FileRes> = await fileRes.json();

    console.log('fileData', fileData);

    userObj.image = fileData.item[0].path;
  }

  const res = await fetch(`${SERVER}/users/${session?.user?.id}`, {
    method: 'PATCH',
    headers: {
      'client-id': `${DBNAME}`,
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userObj),
  });

  const resData = await res.json();

  return resData;
}
