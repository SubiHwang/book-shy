export interface Page {
  path: string;
  label: string; // 페이지 이름
}

export interface TabNavBarProps {
  pages: Page[]; // 페이지 정보 배열
}
