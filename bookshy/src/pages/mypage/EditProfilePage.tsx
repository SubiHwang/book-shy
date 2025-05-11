import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile } from '@/services/mypage/profile';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '@/types/User/user';

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

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || '');
      setGender(profile.gender ?? '');
      setAddress(profile.address ?? '');
      setLatitude(profile.latitude ?? null);
      setLongitude(profile.longitude ?? null);
    }
  }, [profile]);

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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleAddressSearch = () => {
    if (!navigator.geolocation) {
      alert('이 기기에서는 위치 정보 사용이 불가능합니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const response = await fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
            {
              headers: {
                Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
              },
            },
          );
          const data = await response.json();
          const kakaoAddress = data.documents?.[0]?.address?.address_name;

          if (kakaoAddress) {
            setAddress(kakaoAddress);
          } else {
            alert('주소를 찾을 수 없습니다.');
          }
        } catch (err) {
          console.error('주소 검색 오류:', err);
          alert('주소 검색 중 오류가 발생했습니다.');
        }
      },
      (error) => {
        if (error.code === 1) {
          alert('위치 권한이 거부되었습니다.');
        } else {
          alert('위치 정보를 가져오는 데 실패했습니다.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  if (isLoading) {
    return <p className="p-4">프로필을 불러오는 중입니다...</p>;
  }

  return (
    <div className="bg-light-bg min-h-screen">
      <Header title="프로필" onBackClick={() => navigate(-1)} showNotification={false} />

      <div className="px-6 py-4">
        <p className="text-lg font-semibold mt-4 mb-6">프로필을 설정해주세요.</p>

        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={profile?.profileImageUrl || '/default-profile.png'}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">📸</div>
          </div>
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">성별</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="F"
                checked={gender === 'F'}
                onChange={() => setGender('F')}
              />
              여성
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="M"
                checked={gender === 'M'}
                onChange={() => setGender('M')}
              />
              남성
            </label>
          </div>
        </div>

        {/* 주소 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">주소</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddressSearch}
            className="mt-2 px-4 py-1 text-sm bg-pink-100 text-pink-600 rounded border border-pink-300"
          >
            현재 위치로 주소 찾기
          </button>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="w-full mt-6 bg-pink-500 text-white py-3 rounded text-lg font-semibold"
          disabled={isPending}
        >
          {isPending ? '저장 중...' : '저장'}
        </button>

        {/* 로그아웃 */}
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
