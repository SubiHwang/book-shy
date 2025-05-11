import React from 'react';

export interface AddressInputProps {
  address: string;
  onChange: (value: string) => void;
  onFetchLocation: () => void;
  loading?: boolean;
  error?: string | null;
}

const AddressInput: React.FC<AddressInputProps> = ({
  address,
  onChange,
  onFetchLocation,
  loading = false,
  error = null,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">주소</label>
      <input
        type="text"
        value={address}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="예: 서울특별시 강남구 ..."
      />
      <button
        onClick={onFetchLocation}
        className="mt-2 px-4 py-1 text-sm bg-pink-100 text-pink-600 rounded border border-pink-300"
        disabled={loading}
      >
        {loading ? '주소 찾는 중...' : '현재 위치로 주소 찾기'}
      </button>

      {loading && <p className="text-sm text-gray-500 mt-1">📍 위치 정보를 가져오는 중입니다...</p>}
      {error && <p className="text-sm text-red-500 mt-1">❗ {error}</p>}
    </div>
  );
};

export default AddressInput;
