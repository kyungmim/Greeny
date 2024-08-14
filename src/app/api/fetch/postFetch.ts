const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const LIMIT = process.env.NEXT_PUBLIC_LIMIT;

//함수 호출시 타입 지정해주기
export async function fetchPosts<T>(type: string | undefined, page?: string, keyword?: string): Promise<T[]> {
  const params = new URLSearchParams();
  params.set('limit', LIMIT!);
  const url = `${SERVER}/posts?type=${type}`;
  const res = await fetch(url, { headers: { 'client-id': '03-Greeny' } });
  const resJson = await res.json();
  return resJson.item;
}

export async function fetchPost(_id: string) {
  const url = `${SERVER}/posts/${_id}`;
  const res = await fetch(url);
  console.log('res', res);

  return res.json();
}
