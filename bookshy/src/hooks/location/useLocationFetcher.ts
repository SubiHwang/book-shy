import { useState } from 'react';

/**
 * 카카오 좌표→주소 변환 + 위치 정보 반환용 커스텀 훅
 */
export const useLocationFetcher = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 행정구역 접미사 제거 함수
  const simplifyRegionName = (name: string): string => {
    // 특별시, 광역시, 특별자치시, 도, 특별자치도 등 제거
    return name.replace(/(특별시|광역시|특별자치시|특별자치도|자치도|시|도)$/, '');
  };

  const fetchCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('이 기기에서는 위치 정보 사용이 불가능합니다.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {
          const response = await fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
            {
              headers: {
                Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
              },
            },
          );
          const data = await response.json();
          const addressInfo = data.documents?.[0]?.address;

          if (addressInfo) {
            // 행정구역 접미사 제거하고 주소 구성
            const simplifiedRegion1 = simplifyRegionName(addressInfo.region_1depth_name); // 시/도 (예: '서울특별시' -> '서울')
            const region2 = addressInfo.region_2depth_name; // 시/군/구 (그대로 사용)
            const region3 = addressInfo.region_3depth_name; // 동/읍/면 (그대로 사용)
            
            // 시/도 + 시/군/구 + 동/읍/면 형식으로 주소 가공
            const shortAddress = [
              simplifiedRegion1,
              region2,
              region3
            ].filter(Boolean).join(' ');
            
            setAddress(shortAddress);
          } else {
            setError('주소를 찾을 수 없습니다.');
          }
        } catch (e) {
          console.error(e);
          setError('주소 검색 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        if (geoError.code === 1) {
          setError('위치 권한이 거부되었습니다.');
        } else {
          setError('위치 정보를 가져오는 데 실패했습니다.');
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return {
    latitude,
    longitude,
    address,
    loading,
    error,
    fetchCurrentLocation,
  };
};