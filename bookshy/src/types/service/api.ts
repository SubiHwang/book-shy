// 성공 시 응답 타입
// status: 200, message: 'success', data: { ... }, success: true
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  success: boolean;
}

// 실패 시 응답 타입
// status: 400, message: 'error', data: { ... }, success: false
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}
