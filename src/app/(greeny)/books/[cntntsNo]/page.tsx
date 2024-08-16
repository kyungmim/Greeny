import Image from 'next/image';
import styles from './[cntntsNo].module.scss';
import plantList from '@/app/data/plantList.json';
import { Plant } from '../page';

export default function Page({ params }: { params: { cntntsNo: string } }) {
  const plant: Plant = plantList.filter((plant) => plant.cntntsNo === params.cntntsNo)[0];

  if (!plant) return <div>데이터가 없습니다.</div>;

  // plant를 받아 키값이 ""인 경우 '없음'으로 바꿈
  const processedPlant: Plant = Object.entries(plant).reduce((acc, entry) => {
    const [key, value] = entry as [keyof Plant, string];
    acc[key] = value === '' ? '없음' : value;
    return acc;
  }, {} as Plant);

  return (
    <>
      <div className={styles.image_wrapper}>
        <Image src={processedPlant.rtnFileUrl} alt="식물 이미지" className={styles.img} fill />
      </div>

      <div className={styles.content_wrapper}>
        <div className={styles.title}>
          <p>{processedPlant.cntntsSj}</p>
          <span>{processedPlant.plntbneNm}</span>
        </div>
        <div className={styles.detail}>
          <table>
            <tbody>
              <tr>
                <th>물주기</th>
                <td>{processedPlant.waterCycle}</td>
              </tr>
              <tr>
                <th>온도</th>
                <td>{processedPlant.grwhTpCodeNm}</td>
              </tr>
              <tr>
                <th>습도</th>
                <td>{processedPlant.hdCodeNm}</td>
              </tr>
              <tr>
                <th>일조량</th>
                <td>{processedPlant.lighttdemanddoCodeNm}</td>
              </tr>
              <tr>
                <th>비료</th>
                <td>{processedPlant.frtlzrInfo}</td>
              </tr>
              <tr>
                <th>관리수준</th>
                <td>{processedPlant.managelevelCodeNm}</td>
              </tr>
              <tr>
                <th>관리요구도</th>
                <td>{processedPlant.managedemanddoCodeNm}</td>
              </tr>
              <tr>
                <th>병해충</th>
                <td>{processedPlant.dlthtsCodeNm}</td>
              </tr>
              <tr>
                <th>생육형태</th>
                <td>{processedPlant.grwhstleCodeNm}</td>
              </tr>
              <tr>
                <th>생태</th>
                <td>{processedPlant.eclgyCodeNm}</td>
              </tr>
              <tr>
                <th>번식방법</th>
                <td>{processedPlant.prpgtmthCodeNm}</td>
              </tr>
              <tr>
                <th>꽃색</th>
                <td>{processedPlant.flclrCodeNm}</td>
              </tr>
              <tr>
                <th>열매색</th>
                <td>{processedPlant.fmldecolrCodeNm}</td>
              </tr>
              <tr>
                <th>잎색</th>
                <td>{processedPlant.lefcolrCodeNm}</td>
              </tr>
              <tr>
                <th>잎무늬</th>
                <td>{processedPlant.lefmrkCodeNm}</td>
              </tr>
              <tr>
                <th>발화계절</th>
                <td>{processedPlant.prpgtEraInfo}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
