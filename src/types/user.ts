import { ImageRes } from './image';

export interface UserData {
  _id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  type: 'seller';
  loginType?: 'email' | 'google' | 'github';
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

export type UserLoginForm = {
  email: string;
  password: string;
};

export type UserForm = {
  type: 'seller';
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  attach?: FileList;
  image?: string;
};

// 01. 회원 - 02. 회원 정보 수정 - 회원 정보 조회
export type UserInfo = {
  _id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  type: 'seller';
  image?: string;
  createdAt: string;
  updatedAt: string;
  posts: number;
  bookmark: {
    products: number;
    users: number;
    posts: number;
  };
  bookmarkedBy: {
    users: number;
  };
  postViews: number;
};
