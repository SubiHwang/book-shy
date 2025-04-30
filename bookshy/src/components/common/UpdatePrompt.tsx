import { FC } from 'react';

interface UpdatePromptProps {
  needRefresh: boolean;
  updateServiceWorker: (reload?: boolean) => Promise<void>;
}

const UpdatePrompt: FC<UpdatePromptProps> = ({ needRefresh, updateServiceWorker }) => {
  if (!needRefresh) return null; // needRefresh가 false이면 아무것도 렌더링하지 않음
  return (
    <div className="fixed bottom-20 left-2 right-2 bg-primary-light text-white p-4 shadow-lg z-50 rounded-lg">
      <p className="text-center mb-2 font-medium">새로운 버전이 있습니다!</p>
      <div className="flex justify-center">
        <button
          className="bg-white text-primary-light px-4 py-2 rounded font-medium"
          onClick={() => updateServiceWorker(true)}
        >
          업데이트
        </button>
      </div>
    </div>
  );
};

export default UpdatePrompt;
