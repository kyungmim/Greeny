const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export async function fetchPlantsDetail<T>(id: string | undefined) {
  const url = `${SERVER}/products/${id}`;
  const res = await fetch(url, {
    headers: {
      'client-id': `${DBNAME}`,
    },
  });
  const resJson = await res.json();

  return resJson.item;
}

export async function fetchPlantsLike<T>(accessToken: string | undefined) {
  const url = `${SERVER}/bookmarks/product`;
  const res = await fetch(url, {
    headers: {
      'client-id': `${DBNAME}`,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const resJson = await res.json();

  return resJson.item;
}
