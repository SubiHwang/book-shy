import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddISBNResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isbn = location.state?.isbn;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black px-4">
      <h1 className="text-2xl font-bold mb-4">📕 ISBN 인식 결과</h1>

      {isbn ? (
        <>
          <p className="text-xl mb-6">{isbn}</p>
          <button
            onClick={() => navigate('/bookshelf/add/barcode')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md"
          >
            다시 스캔하기
          </button>
        </>
      ) : (
        <p className="text-red-500">❌ ISBN 정보가 전달되지 않았습니다.</p>
      )}
    </div>
  );
};

export default AddISBNResultPage;
