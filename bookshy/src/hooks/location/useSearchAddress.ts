import { useEffect, useCallback, useState } from 'react';

interface AddressData {
  address: string;
  zonecode: string;
  latitude?: number;
  longitude?: number;
}

interface PostcodeData {
  userSelectedType: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  apartment: string;
  zonecode: string;
  sido: string;      // 시/도
  sigungu: string;   // 시/군/구
  bname: string;     // 동/읍/면
  roadname: string;  // 도로명
}

interface DaumPostcode {
  open: () => void;
}

interface DaumPostcodeOptions {
  oncomplete: (data: PostcodeData) => void;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: DaumPostcodeOptions) => DaumPostcode;
    };
  }
}

const useSearchAddress = (onAddressSelected: (data: AddressData) => void) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 행정구역 접미사 제거 함수
  const simplifyRegionName = (name: string): string => {
    // 특별시, 광역시, 특별자치시, 도, 특별자치도 등 제거
    return name.replace(/(특별시|광역시|특별자치시|특별자치도|자치도|시|도)$/, '');
  };

  // 주소로 좌표를 가져오는 함수
  const fetchCoordinatesByAddress = useCallback(async (address: string): Promise<Coordinates | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // 카카오 주소→좌표 변환 API 사용
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.documents && data.documents.length > 0) {
        const coordinates: Coordinates = {
          latitude: parseFloat(data.documents[0].y),
          longitude: parseFloat(data.documents[0].x)
        };
        return coordinates;
      }
      
      setError('해당 주소의 좌표를 찾을 수 없습니다.');
      return null;
    } catch (e) {
      console.error('좌표 변환 중 오류 발생:', e);
      setError('좌표 변환 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 카카오 주소검색 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // 안전하게 스크립트 제거 시도
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 주소검색 팝업 열기 함수
  const openAddressSearch = useCallback(async () => {
    // window.daum이 로드되었는지 확인
    if (!window.daum || !window.daum.Postcode) {
      alert('주소검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    new window.daum.Postcode({
      oncomplete: async function(data: PostcodeData) {
        // 행정구역 접미사 제거하고 주소 구성
        const simplifiedRegion1 = simplifyRegionName(data.sido); // 시/도 (예: '서울특별시' -> '서울')
        const region2 = data.sigungu; // 시/군/구 (그대로 사용)
        const region3 = data.bname; // 동/읍/면 (그대로 사용)
        
        // 시/도 + 시/군/구 + 동/읍/면 형식으로 주소 가공
        const shortAddress = [
          simplifiedRegion1,
          region2,
          region3
        ].filter(Boolean).join(' ');
        
        // 좌표 변환 API로 주소의 위도/경도 얻기
        // 전체 주소(도로명 또는 지번)로 검색하면 더 정확한 결과를 얻을 수 있음
        const searchAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        const coordinates = await fetchCoordinatesByAddress(searchAddress);
        
        // 콜백으로 주소 및 좌표 전달
        onAddressSelected({
          address: shortAddress,
          zonecode: data.zonecode,
          latitude: coordinates?.latitude,
          longitude: coordinates?.longitude
        });
      }
    }).open();
  }, [onAddressSelected, fetchCoordinatesByAddress]);

  return { 
    openAddressSearch,
    isLoading,
    error,
    // 유틸리티 함수도 외부로 노출
    fetchCoordinatesByAddress
  };
};

export default useSearchAddress;