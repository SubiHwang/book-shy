import { FC, useState } from 'react';

interface UpdatePromptProps {
  needRefresh: boolean;
  updateServiceWorker: (reload?: boolean) => Promise<void>;
}

const UpdatePrompt: FC<UpdatePromptProps> = ({ needRefresh, updateServiceWorker }) => {
  const [updating, setUpdating] = useState(false);

  if (!needRefresh || updating) return null;

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateServiceWorker(true);
      // 업데이트 요청 후 updating 상태가 true로 유지되어 화면에서 알림이 사라짐
    } catch (error) {
      console.error('업데이트 중 오류 발생:', error);
      setUpdating(false); // 오류 발생 시에만 다시 표시
    }
  };

  return (
    <div className="fixed bottom-24 left-2 right-2 bg-primary-light text-white p-4 shadow-lg z-50 rounded-lg">
      <p className="text-center mb-2 font-medium">새로운 버전이 있습니다!</p>
      <div className="flex justify-center">
        <button
          className="bg-white text-primary-light px-4 py-2 rounded font-medium"
          onClick={handleUpdate}
        >
          업데이트
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
