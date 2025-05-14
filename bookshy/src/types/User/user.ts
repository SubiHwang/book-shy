export interface UserProfile {
  nickname: string;
  profileImageUrl: string;
  bookShyScore: number; // float 허용됨
  badge: string;
  address: string | null;
  age: number;
  gender: 'M' | 'F' | null;
  latitude: number | null;
  longitude: number | null;
}

export interface AddressUpdateRequest {
  address: string;
  latitude: number;
  longitude: number;
}
