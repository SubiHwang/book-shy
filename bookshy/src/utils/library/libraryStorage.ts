// src/utils/libraryStorage.ts

// 서재에 추가된 책 관리를 위한 세션 스토리지 유틸리티

// 세션 스토리지 키
const LIBRARY_BOOKS_KEY = 'library_books_session';

// 서재에 책이 있는지 확인
export const isBookInLibrary = (itemId?: number): boolean => {
  if (!itemId) return false;

  try {
    const storedBooks = sessionStorage.getItem(LIBRARY_BOOKS_KEY);
    if (!storedBooks) return false;

    const booksMap = JSON.parse(storedBooks);
    return !!booksMap[itemId];
  } catch (error) {
    console.error('세션 스토리지 읽기 오류:', error);
    return false;
  }
};

// 서재에 책 추가
export const addBookToLibrary = (itemId: number, libraryId?: number): void => {
  if (!itemId) return;

  try {
    const storedBooks = sessionStorage.getItem(LIBRARY_BOOKS_KEY) || '{}';
    const booksMap = JSON.parse(storedBooks);

    booksMap[itemId] = {
      libraryId: libraryId || true,
      addedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(LIBRARY_BOOKS_KEY, JSON.stringify(booksMap));
    console.log(`책 ID ${itemId} 세션 스토리지에 저장됨`);
  } catch (error) {
    console.error('세션 스토리지 쓰기 오류:', error);
  }
};

// 서재에서 책 ID에 해당하는 libraryId 가져오기
export const getBookLibraryId = (itemId?: number): number | undefined => {
  if (!itemId) return undefined;

  try {
    const storedBooks = sessionStorage.getItem(LIBRARY_BOOKS_KEY);
    if (!storedBooks) return undefined;

    const booksMap = JSON.parse(storedBooks);
    const bookData = booksMap[itemId];

    return bookData?.libraryId && bookData.libraryId !== true ? bookData.libraryId : undefined;
  } catch (error) {
    console.error('세션 스토리지 읽기 오류:', error);
    return undefined;
  }
};
