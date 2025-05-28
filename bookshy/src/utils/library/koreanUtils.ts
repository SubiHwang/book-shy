// src/utils/koreanUtils.ts
/**
 * 받침 유무에 따른 조사 결정
 * @param text 조사를 붙일 단어
 * @param withBatchim 받침이 있을 때 사용할 조사
 * @param withoutBatchim 받침이 없을 때 사용할 조사
 * @returns 적절한 조사
 */
export const getParticle = (
  text: string,
  withBatchim: string = '이',
  withoutBatchim: string = '예',
): string => {
  if (!text) return withoutBatchim;

  const lastChar = text.charAt(text.length - 1);
  const charCode = lastChar.charCodeAt(0);

  // 한글 범위 (가~힣) 확인
  if (charCode >= 0xac00 && charCode <= 0xd7a3) {
    // 받침 있는지 확인
    return (charCode - 0xac00) % 28 > 0 ? withBatchim : withoutBatchim;
  }

  // 한글이 아닌 경우 (영문 등)
  return withoutBatchim;
};

// 사용 예:
// getParticle("소설", "이네요!", "예요!") => "이네요!"
// getParticle("만화", "이네요!", "예요!") => "예요!"
