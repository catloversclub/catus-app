export type Gender = "FEMALE" | "MALE" | "UNKNOWN";

interface Cat {
  id: string;
  name: string;
  gender: Gender;
  profileImageUrl: string | null;
  birthDate: string | null;
  breed: string | null;
  personalities: number[];
  appearances: number[];
  type: string | null;
  createdAt: string;
  butlerId: string;
}

type CreateCatRequest = Partial<Omit<Cat, "id">>;
type UpdateCatRequest = Partial<Omit<Cat, "id">>;
type CreateCatResponse = Omit<Cat, "personalities" | "appearances">;

type CatProfile = Omit<Cat, "id" | "createdAt" | "butlerId" | "type">;

export type GetMyCatsResponse = Cat[];

export type GetCatByIdResponse = Cat;

export type UpdateCatResponse = Cat;

export {
  Cat,
  CatProfile,
  CreateCatRequest,
  CreateCatResponse,
  UpdateCatRequest,
};
