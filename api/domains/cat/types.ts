export interface Cat {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  profileImageUrl: string | null;
  birthDate: string | null;
  breed: string | null;
  type: string | null;
  createdAt: string;
  butlerId: string;
}

export type GetMyCatsResponse = Cat[];

export type GetCatByIdResponse = Cat;

export interface CreateCatRequest {
  name: string;
  appearanceIds?: number[];
  personalityIds?: number[];
}

export type CreateCatResponse = Cat;

export interface UpdateCatRequest {
  name?: string;
  appearanceIds?: number[];
  personalityIds?: number[];
}

export type UpdateCatResponse = Cat;

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}
