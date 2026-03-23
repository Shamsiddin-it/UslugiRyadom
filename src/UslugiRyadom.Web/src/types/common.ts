export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResult<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export interface PagedResponse<T> {
  success: boolean;
  message: string;
  data: PagedResult<T>;
}

export interface Address {
  city?: string | null;
  district?: string | null;
  street?: string | null;
  house?: string | null;
  landmark?: string | null;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

export type QueryParamValue = string | number | boolean | undefined | null;
