import { FC } from 'react';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';

const MatchingPage: FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header
        title="매칭 추천"
        onBackClick={() => navigate(-1)}
        showBackButton={true}
        showNotification={false}
        extraButton={null}
        extraButtonIcon={null}
        onExtraButtonClick={() => {}}
        className="bg-white shadow-md"
      />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Matching Page</h1>
        <p className="text-gray-600">This is the matching page content.</p>
      </div>
    </>
  );
};
export default MatchingPage;
