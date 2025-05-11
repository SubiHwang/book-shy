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
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname);
      setGender(profile.gender);
      setAddress(profile.address);
    }
  }, [profile]);

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      alert('프로필이 저장되었습니다.');
      navigate('/mypage');
    },
  });

  const handleSave = () => {
    saveProfile({ nickname, gender, address });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 혹은 logout API 호출
    navigate('/login');
  };

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
                value="FEMALE"
                checked={gender === 'FEMALE'}
                onChange={() => setGender('FEMALE')}
              />
              여성
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                value="MALE"
                checked={gender === 'MALE'}
                onChange={() => setGender('MALE')}
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
          <button className="mt-2 px-4 py-1 text-sm bg-pink-100 text-pink-600 rounded border border-pink-300">
            주소 검색
          </button>
        </div>

        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="w-full mt-6 bg-pink-500 text-white py-3 rounded text-lg font-semibold"
          disabled={isPending}
        >
          저장
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
