import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile, uploadProfileImage } from '@/services/mypage/profile';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '@/types/User/user';
import ProfileImage from '@/components/mypage/profile/ProfileImage';
import GenderSelector from '@/components/mypage/profile/GenderSelector';
import { useLocationFetcher } from '@/hooks/location/useLocationFetcher';
import useSearchAddress from '@/hooks/location/useSearchAddress';
import { Locate, Search } from 'lucide-react';
import { notify } from '@/components/common/CustomToastContainer';
import { authAxiosInstance } from '@/services/axiosInstance';

const EditProfilePage = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: fetchUserProfile,
  });

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const {
    fetchCurrentLocation,
    address: fetchedAddress,
    latitude: currentLat,
    longitude: currentLng,
    loading: isLocating,
    error: locationError,
  } = useLocationFetcher();

  // 주소 검색 훅 사용
  const { openAddressSearch, isLoading: isAddressSearchLoading } = useSearchAddress((data) => {
    if (data && data.address) {
      setAddress(data.address);

      if (data.latitude !== undefined && data.longitude !== undefined) {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      }
    }
  });

  // 통합 로딩 상태
  const isLocationLoading = isLocating || isAddressSearchLoading;

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || '');
      setGender(profile.gender ?? '');
      setAddress(profile.address ?? '');
      setLatitude(profile.latitude ?? null);
      setLongitude(profile.longitude ?? null);
      setProfileImageUrl(profile.profileImageUrl || '/default-profile.png');
    }
  }, [profile]);

  useEffect(() => {
    if (fetchedAddress) setAddress(fetchedAddress);
    if (currentLat !== null) setLatitude(currentLat);
    if (currentLng !== null) setLongitude(currentLng);
  }, [fetchedAddress, currentLat, currentLng]);

  const queryClient = useQueryClient();

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (res) => {
      if (res.accessToken) {
        localStorage.setItem('auth_token', res.accessToken);
        // ✅ axios 인스턴스에도 즉시 반영
        authAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`;
      }
      if (res.refreshToken) {
        localStorage.setItem('refresh_token', res.refreshToken);
      }

      // ✅ 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      notify.success('프로필 저장에 성공했습니다.');
      navigate('/mypage');
    },
    onError: () => {
      notify.error('프로필 저장에 실패했습니다.');
    },
  });

  const handleSave = () => {
    if (!nickname.trim()) return alert('닉네임을 입력해주세요.');
    if (gender === '') return alert('성별을 선택해주세요.');

    saveProfile({
      nickname,
      gender,
      address,
      latitude,
      longitude,
    });
  };

  const handleImageChange = async (file: File) => {
    const formData = new FormData();
    formData.append('imageFile', file);

    try {
      const res = await uploadProfileImage(formData);
      setProfileImageUrl(res.imageUrl);
      alert('프로필 이미지가 변경되었습니다.');
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('firebase_token');
    navigate('/login');
  };

  const handleSearchAddress = () => {
    openAddressSearch();
  };

  const handleGetCurrentLocation = async () => {
    await fetchCurrentLocation();
  };

  if (isLoading) {
    return <p className="p-4">프로필을 불러오는 중입니다...</p>;
  }

  return (
    <div className="bg-light-bg min-h-screen">
      <Header title="프로필" onBackClick={() => navigate(-1)} showNotification={false} />

      <div className="px-6 py-4">
        <p className="text-lg font-semibold mt-4 mb-6">프로필을 설정해주세요.</p>

        <ProfileImage src={profileImageUrl} onImageChange={handleImageChange} />

        <div className="mb-4">
          <label className="block mb-1 font-medium">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <GenderSelector gender={gender} onChange={setGender} />

        <div className="mb-4">
          <label className="block mb-1 font-medium">주소</label>
          <div className="relative mb-2">
            <input
              type="text"
              value={address}
              readOnly
              placeholder="주소를 검색하거나 현재 위치를 가져오세요"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-gray-50 text-light-text-secondary focus:outline-none"
            />
            {isLocationLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {locationError && <p className="text-light-status-error text-sm mb-2">{locationError}</p>}

          <div className="flex space-x-2">
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLocationLoading}
              className="flex-1 py-2 bg-gray-100 text-primary rounded-md flex items-center justify-center transition hover:bg-gray-200 text-sm"
            >
              <Locate className="mr-1" size={16} />
              현재 위치
            </button>
            <button
              onClick={handleSearchAddress}
              disabled={isLocationLoading}
              className="flex-1 py-2 bg-gray-100 text-light-text rounded-md flex items-center justify-center transition hover:bg-gray-200 text-sm"
            >
              <Search className="mr-1" size={16} />
              주소 검색
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-primary text-white py-3 rounded-md text-lg font-semibold transition hover:bg-primary/90"
          disabled={isPending || isLocationLoading}
        >
          {isPending ? '저장 중...' : '저장'}
        </button>

        <button
          onClick={handleLogout}
          className="w-full mt-3 border border-primary/30 text-primary py-3 rounded-md text-lg transition hover:bg-gray-50"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
