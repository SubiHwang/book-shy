import Header from '@/components/common/Header';
import { FC, useEffect, useState } from 'react';
import { MapPin, Locate, Search } from 'lucide-react';
import { useLocationFetcher } from '@/hooks/location/useLocationFetcher';
import { useNavigate } from 'react-router-dom';

const LocationSetting: FC = () => {
  const { fetchCurrentLocation, address, loading, error } = useLocationFetcher();
  const [isGpasEnabled, setIsGpsEnabled] = useState<boolean>(true);
  const navigate = useNavigate();

  // GPS 사용 가능 여부 확인
  useEffect(() => {
    const checkGpsAvailability = () => {
      if (!navigator.geolocation) {
        setIsGpsEnabled(false);
        return;
      }

      // GPS 권한 확인을 위한 테스트 호출
      navigator.permissions
        ?.query({ name: 'geolocation' })
        .then((permissionStatus) => {
          setIsGpsEnabled(permissionStatus.state !== 'denied');

          // 권한 상태 변경 감지
          permissionStatus.onchange = () => {
            setIsGpsEnabled(permissionStatus.state !== 'denied');
          };
        })
        .catch(() => {
          // permissions API를 지원하지 않는 경우, 실제 호출로 확인
          navigator.geolocation.getCurrentPosition(
            () => setIsGpsEnabled(true),
            () => setIsGpsEnabled(false),
            { timeout: 3000 },
          );
        });
    };

    checkGpsAvailability();
  }, []);

  const handleAddressSelect = () => {
    // 주소 선택 처리 로직
    if (address) {
      // 여기에 주소 저장 로직 추가
      // 저장 후 메인 페이지로 이동
      navigate('/');
    }
  };

  const handleSearchAddress = () => {
    alert('주소 검색 기능은 구현되지 않았습니다.');
  };

  // API 키 확인을 위한 디버깅 메시지
  useEffect(() => {
    if (!import.meta.env.VITE_KAKAO_REST_API_KEY) {
      console.warn('카카오 API 키가 설정되지 않았습니다.');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-light-bg">
      <Header
        title="위치 설정"
        showBackButton={false}
        showNotification={false}
        className="bg-white shadow-sm"
      />

      <main className="flex-1 px-4 py-5 max-w-md mx-auto w-full">
        {/* 위치 카드 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 w-full">
          <div className="flex items-center mb-1">
            <MapPin className="text-primary mr-2" size={20} />
            <p className="text-base font-medium text-light-text">내 위치 찾기</p>
          </div>
          <div className="flex flex-col justify-center items-center mb-2">
            <p className="text-xs font-light text-light-text-secondary">
              내 주변 이웃들과 매칭되기 위해서 위치 등록이 필요해요!
            </p>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              readOnly={true}
              value={address}
              placeholder="위치를 가져오려면 아래 버튼을 클릭하세요"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-50 text-light-text-secondary focus:outline-none"
            />
          </div>

          {error ? (
            <div className="mb-4">
              <p className="text-light-status-error text-sm mb-3">{error}</p>
              <button
                onClick={fetchCurrentLocation}
                disabled={!isGpasEnabled || loading}
                className={`w-full py-2.5 rounded-md flex items-center justify-center transition text-sm
    ${
      isGpasEnabled
        ? 'bg-primary text-white hover:bg-primary/90'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
              >
                <Locate className="mr-1" size={16} />
                현재 위치 가져오기
              </button>
            </div>
          ) : address ? (
            <div>
              <button
                onClick={handleAddressSelect}
                className="w-full py-2.5 bg-primary text-white rounded-md mb-2 transition hover:bg-primary/90 text-sm"
              >
                이 주소로 설정하기
              </button>
              <button
                onClick={fetchCurrentLocation}
                disabled={!isGpasEnabled || loading}
                className="w-full py-2.5 bg-gray-100 text-primary rounded-md flex items-center justify-center transition hover:bg-gray-200 text-sm"
              >
                <Locate className="mr-1" size={16} />
                현재 위치 다시 가져오기
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <button
                onClick={fetchCurrentLocation}
                disabled={!isGpasEnabled || loading}
                className="w-full py-2.5 bg-primary text-white rounded-md flex items-center justify-center transition hover:bg-primary/90 text-sm"
              >
                <Locate className="mr-1" size={16} />
                현재 위치 가져오기
              </button>
              <button
                onClick={handleSearchAddress}
                disabled={loading}
                className="w-full py-2.5 bg-gray-100 text-light-text rounded-md flex items-center justify-center transition hover:bg-gray-200 text-sm"
              >
                <Search className="mr-1" size={16} />
                주소 검색하기
              </button>
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="p-4 bg-gray-100 rounded-lg text-light-text-secondary text-xs md:text-sm">
          <p>
            위치 정보 액세스를 허용해주세요. 앱이 GPS를 통해 현재 위치의 주소를 자동으로 가져옵니다.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LocationSetting;
