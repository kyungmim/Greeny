import { auth } from '@/auth';
import PageTemplate from './PageTemplate';
import { List, MultiItem } from '@/types/response';
import { PlantBookmark } from '@/types/bookmark';
import { PlantListRes } from '@/types/plant';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;
const DBNAME = process.env.NEXT_PUBLIC_DB_NAME;

export default async function Page() {
  const session = await auth();
  if (!session) return '로그인 만료';
  const plantBookmarkRes = await fetch(SERVER + '/bookmarks/product', {
    headers: {
      'client-id': `${DBNAME}`,
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  const plantBookmarkList = (await plantBookmarkRes.json()) as List<PlantBookmark>;

  const allPlantRes = await fetch(SERVER + '/products', {
    headers: {
      'client-id': `${DBNAME}`,
    },
  });

  const allPlantList: MultiItem<PlantListRes> = await allPlantRes.json();

  // 내가 북마크한 식물의 학명을 알아온다.
  const processedPlantBookmarkList = {} as List<PlantBookmark>;
  processedPlantBookmarkList.item = plantBookmarkList.item.map((plantBookmark) => {
    const plant = allPlantList.item.find((plant) => plant._id === plantBookmark.product._id);
    // TODO: REFACTOR
    return {
      ...plantBookmark,
      createdAt: plant!.scientificName,
    };
  });
  return <PageTemplate list={processedPlantBookmarkList.item} />;
}
