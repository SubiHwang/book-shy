// src/types/mylibrary/api.ts
import { AxiosResponse } from 'axios';
import { ISBNSearchResponse } from './isbn';
import { AddBookResponse } from './isbn';

// Axios 응답 타입 재정의
export type CustomAxiosResponse<T> = AxiosResponse<T>;

// 다른 응답 타입들도 필요에 따라 정의 가능
export type ISBNSearchAxiosResponse = CustomAxiosResponse<ISBNSearchResponse>;
export type AddBookAxiosResponse = CustomAxiosResponse<AddBookResponse>;
