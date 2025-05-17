import { useEffect, useCallback } from 'react';

interface AddressData {
  address: string;
  zonecode: string;
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

declare global {
  interface Window {
    daum: {
      Postcode: new (options: DaumPostcodeOptions) => DaumPostcode;
    };
  }
}

const useSearchAddress = (onAddressSelected: (data: AddressData) => void) => {
  // 행정구역 접미사 제거 함수
  const simplifyRegionName = (name: string): string => {
    // 특별시, 광역시, 특별자치시, 도, 특별자치도 등 제거
    return name.replace(/(특별시|광역시|특별자치시|특별자치도|자치도|시|도)$/, '');
  };

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
  const openAddressSearch = useCallback(() => {
    // window.daum이 로드되었는지 확인
    if (!window.daum || !window.daum.Postcode) {
      alert('주소검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    new window.daum.Postcode({
      oncomplete: function(data: PostcodeData) {
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
        
        // 콜백으로 주소 전달
        onAddressSelected({
          address: shortAddress,
          zonecode: data.zonecode
        });
      }
    }).open();
  }, [onAddressSelected]);

  return { openAddressSearch };
};

export default useSearchAddress;