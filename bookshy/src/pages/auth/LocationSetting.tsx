import Header from '@/components/common/Header';
import { FC, useEffect, useState } from 'react';
import { MapPin, Locate, Search } from 'lucide-react';
import { useLocationFetcher } from '@/hooks/location/useLocationFetcher';
import useSearchAddress from '@/hooks/location/useSearchAddress'; // 주소 검색 훅 임포트
import { useNavigate } from 'react-router-dom';
import { updateUserAddress } from '@/services/mypage/profile';
import type { AddressUpdateRequest } from '@/types/User/user';

const LocationSetting: FC = () => {
  const { fetchCurrentLocation, address, latitude, longitude, loading, error } =
    useLocationFetcher();

  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean>(true);
  const navigate = useNavigate();

  // 선택한 주소 정보를 저장할 상태 (useLocationFetcher와 별개)
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedLatitude, setSelectedLatitude] = useState<number | null>(null);
  const [selectedLongitude, setSelectedLongitude] = useState<number | null>(null);

  // 사용할 주소와 좌표 (GPS 또는 검색 결과)
  const finalAddress = selectedAddress || address;
  const finalLatitude = selectedLatitude !== null ? selectedLatitude : latitude;
  const finalLongitude = selectedLongitude !== null ? selectedLongitude : longitude;

  // 주소 검색 훅 사용 - 위도/경도 정보를 포함한 결과 처리
  const { openAddressSearch, isLoading: isAddressSearchLoading, error: addressSearchError } = useSearchAddress((data) => {
    // 주소 검색 결과 처리
    if (data && data.address) {
      // 상태 업데이트 - 이제 실제 좌표 정보 사용
      setSelectedAddress(data.address);
      
      if (data.latitude !== undefined && data.longitude !== undefined) {
        setSelectedLatitude(data.latitude);
        setSelectedLongitude(data.longitude);
      } else {
        console.warn('주소 검색 결과에 좌표 정보가 없습니다.');
        setSelectedLatitude(null);
        setSelectedLongitude(null);
      }
    }
  });

  // 현재 위치 다시 가져오기 - 선택한 주소 초기화
  const handleGetCurrentLocation = () => {
    setSelectedAddress('');
    setSelectedLatitude(null);
    setSelectedLongitude(null);
    fetchCurrentLocation();
  };

  // GPS 사용 가능 여부 확인
  useEffect(() => {
    const checkGpsAvailability = () => {
      if (!navigator.geolocation) {
        setIsGpsEnabled(false);
        return;
      }

      navigator.permissions
        ?.query({ name: 'geolocation' })
        .then((permissionStatus) => {
          setIsGpsEnabled(permissionStatus.state !== 'denied');
          permissionStatus.onchange = () => {
            setIsGpsEnabled(permissionStatus.state !== 'denied');
          };
        })
        .catch(() => {
          navigator.geolocation.getCurrentPosition(
            () => setIsGpsEnabled(true),
            () => setIsGpsEnabled(false),
            { timeout: 3000 },
          );
        });
    };

    checkGpsAvailability();
  }, []);

  const handleAddressSelect = async () => {
    try {
      if (!finalAddress || finalLatitude === null || finalLongitude === null) {
        alert('위치 정보를 먼저 가져와주세요.');
        return;
      }

      const payload: AddressUpdateRequest = {
        address: finalAddress,
        latitude: finalLatitude,
        longitude: finalLongitude,
      };

      await updateUserAddress(payload);
      navigate('/');
    } catch (err) {
      console.error('주소 저장 중 오류 발생:', err);
      alert('주소 저장에 실패했습니다.');
    }
  };

  // 주소 검색 버튼 핸들러
  const handleSearchAddress = () => {
    openAddressSearch();
  };

  // 모든 로딩 상태와 오류 메시지 통합
  const isLoading = loading || isAddressSearchLoading;
  const finalError = error || addressSearchError;

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
              readOnly
              value={finalAddress}
              placeholder="위치를 가져오려면 아래 버튼을 클릭하세요"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-50 text-light-text-secondary focus:outline-none"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {finalError && !finalAddress ? (
            <div className="mb-4">
              <p className="text-light-status-error text-sm mb-3">{finalError}</p>
              <button
                onClick={handleGetCurrentLocation}
                disabled={!isGpsEnabled || isLoading}
                className={`w-full py-2.5 rounded-md flex items-center justify-center transition text-sm
                  ${
                    isGpsEnabled
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Locate className="mr-1" size={16} />
                현재 위치 가져오기
              </button>
            </div>
          ) : finalAddress ? (
            <div>
              <button
                onClick={handleAddressSelect}
                disabled={finalLatitude === null || finalLongitude === null || isLoading}
                className="w-full py-2.5 bg-primary text-white rounded-md mb-2 transition hover:bg-primary/90 text-sm"
              >
                이 주소로 설정하기
              </button>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={!isGpsEnabled || isLoading}
                  className="w-full py-2.5 bg-gray-100 text-primary rounded-md flex items-center justify-center transition hover:bg-gray-200 text-sm"
                >
                  <Locate className="mr-1" size={16} />
                  현재 위치 다시 가져오기
                </button>
                <button
                  onClick={handleSearchAddress}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-gray-100 text-light-text rounded-md flex items-center justify-center transition hover:bg-gray-200 text-sm"
                >
                  <Search className="mr-1" size={16} />
                  주소 검색하기
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleGetCurrentLocation}
                disabled={!isGpsEnabled || isLoading}
                className="w-full py-2.5 bg-primary text-white rounded-md flex items-center justify-center transition hover:bg-primary/90 text-sm"
              >
                <Locate className="mr-1" size={16} />
                현재 위치 가져오기
              </button>
              <button
                onClick={handleSearchAddress}
                disabled={isLoading}
                className="w-full py-2.5 bg-gray-100 text-light-text rounded-md flex items-center justify-center transition hover:bg-gray-200 text-sm"
              >
                <Search className="mr-1" size={16} />
                주소 검색하기
              </button>
            </div>
          )}
        </div>

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