import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile, uploadProfileImage } from '@/services/mypage/profile';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '@/types/User/user';
import ProfileImage from '@/components/mypage/profile/ProfileImage';
import GenderSelector from '@/components/mypage/profile/GenderSelector';
import AddressInput from '@/components/mypage/profile/AddressInput';
import { useLocationFetcher } from '@/hooks/location/useLocationFetcher';

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

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      alert('프로필이 저장되었습니다.');
      navigate('/mypage');
    },
    onError: () => {
      alert('프로필 저장에 실패했습니다.');
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

        <AddressInput
          address={address}
          onChange={setAddress}
          onFetchLocation={async () => {
            await fetchCurrentLocation();
            setAddress(fetchedAddress);
            setLatitude(currentLat);
            setLongitude(currentLng);
          }}
          loading={isLocating}
          error={locationError}
        />

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-pink-500 text-white py-3 rounded text-lg font-semibold"
          disabled={isPending}
        >
          {isPending ? '저장 중...' : '저장'}
        </button>

        <button
          onClick={handleLogout}
          className="w-full mt-3 border border-pink-300 text-pink-500 py-3 rounded text-lg"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
