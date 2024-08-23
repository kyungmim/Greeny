'use server';

import { auth } from '@/auth';
import { FileRes } from '@/types/image';
import { PlantForm, PlantRes } from '@/types/plant';
import { DiaryForm, DiaryRes } from '@/types/post';
import { ApiResWithValidation, MultiItem, SingleItem } from '@/types/response';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

//다이어리 추가
export async function DiaryNew(formData: FormData, id: string): Promise<ApiResWithValidation<SingleItem<DiaryRes>, DiaryForm>> {
  const session = await auth();
  const diaryObj = {
    type: formData.get('type') || 'diary',
    product_id: Number(id),
    seller_id: session?.user && session?.user.id,
    title: formData.get('title'),
    content: formData.get('content'),
    extra: { plantState: formData.get('plantState'), action: formData.get('action'), actionDate: formData.get('actionDate') },
    image: [{ path: '', name: '' }],
  };
  const attach = formData.get('attach') as File;

  if (attach && attach?.size > 0) {
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

    console.log(fileData);
    if (fileData.ok) {
      diaryObj.image = fileData.item.map((image) => ({
        path: image.path,
        name: image.originalname,
      }));
    }
  }

  const res = await fetch(`${SERVER}/posts`, {
    method: 'POST',
    headers: {
      'client-id': `${DBNAME}`,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(diaryObj),
  });
  const resJson = await res.json();
  return resJson;
}

//식물 추가
export async function plantNew(formData: FormData): Promise<ApiResWithValidation<SingleItem<PlantRes>, PlantForm>> {
  const session = await auth();
  const plantObj = {
    price: 999,
    quantity: 999,
    name: formData.get('name'),
    scientificName: formData.get('scientificName'),
    light: formData.get('light'),
    grwhTp: formData.get('grwhTp'),
    humidity: formData.get('humidity'),
    adoptionDate: formData.get('adoptionDate'),
    waterCycle: formData.get('waterCycle'),
    content: formData.get('content'),
    mainImages: [{ path: '', name: '' }],
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

    console.log(fileData);

    plantObj.mainImages = [
      {
        path: fileData.item[0].path,
        name: fileData.item[0].name,
      },
    ];
  }

  const res = await fetch(`${SERVER}/seller/products`, {
    method: 'POST',
    headers: {
      'client-id': `${DBNAME}`,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify(plantObj),
  });
  const resJson = await res.json();
  return resJson;
}

//식물 삭제
export async function plantsDelete<T>(id: number | undefined) {
  const session = await auth();

  const url = `${SERVER}/seller/products/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'client-id': `${DBNAME}`,
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  const resJson = await res.json();

  return resJson;
}
