// src/services/mylibrary/bookAddService.ts
import { authAxiosInstance } from '@/services/axiosInstance';
import { Library } from '@/types/mylibrary/library';

// 직접 입력한 도서 등록 함수
export const addBookBySelf = async (
  userId: number,
  title: string,
  author: string,
  publisher: string,
  coverImage: File | null,
  isPublic: boolean,
): Promise<Library> => {
  try {
    console.log('직접 입력 도서 등록 요청:', {
      userId,
      title,
      author,
      publisher,
      hasImage: !!coverImage,
      isPublic,
    });

    // FormData 객체 생성
    const formData = new FormData();

    // 이미지 파일 추가 (있는 경우에만)
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // API 요청 URL 생성 (쿼리 파라미터에 정보 추가)
    const url = `/library/self/add?userId=${userId}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&publisher=${encodeURIComponent(publisher)}&isPublic=${isPublic}`;

    console.log('API 요청 URL:', url);

    // multipart/form-data로 요청 전송
    const response = await authAxiosInstance.post<Library>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('직접 입력 도서 등록 성공:', response);
    return response as unknown as Library;
  } catch (error) {
    console.error('직접 입력 도서 등록 오류:', error);
    throw error;
  }
};
