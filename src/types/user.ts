import { ImageRes } from './image';

export interface UserData {
  _id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  type: 'seller';
  image?: ImageRes[];
  token?: {
    accessToken: string;
    refreshToken: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type UserSimple = {
  _id: number;
  name: string;
  image: string;
};

export type UserForm = {
  type: 'seller';
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  //이미지 이슈 해결후 확인하기
  attach?: string | string[];
  profileImage?: string;
};
