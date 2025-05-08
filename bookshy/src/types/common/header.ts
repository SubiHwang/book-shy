export interface HeaderProps {
  title: string; // 페이지 제목
  onBackClick?: () => void; // 뒤로가기 버튼 클릭 핸들러
  showBackButton?: boolean; // 뒤로가기 버튼 표시 여부
  showNotification?: boolean; // 알림 버튼 표시 여부
  extraButton?: React.ReactNode; // 추가 버튼 (예: 설정 버튼 등)
  extraButtonIcon?: React.ReactNode; // 추가 버튼 아이콘 (예: 설정 아이콘 등)
  onExtraButtonClick?: () => void; // 추가 버튼 클릭 핸들러
  className?: string; // 추가 클래스 이름
}
