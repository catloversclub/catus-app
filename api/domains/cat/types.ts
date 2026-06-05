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
  type: number | null;
  createdAt: string;
  butlerId: string;
}

type CreateCatRequest = Pick<Cat, "name"> &
  Partial<
    Pick<
      Cat,
      | "gender"
      | "profileImageUrl"
      | "birthDate"
      | "breed"
      | "personalities"
      | "appearances"
    >
  >;
type UpdateCatRequest = Partial<CreateCatRequest>;
type CreateCatResponse = Cat;
type DeleteCatResponse = Omit<Cat, "appearances" | "personalities">;

type UserCat = Cat & {
  isFollowedByMe: boolean;
};

type CatProfile = Omit<Cat, "id" | "createdAt" | "butlerId" | "type">;

export type GetMyCatsResponse = Cat[];
export type GetUserCatsResponse = UserCat[];

export type GetCatByIdResponse = Cat;

export type UpdateCatResponse = Cat;

export {
  Cat,
  CatProfile,
  CreateCatRequest,
  CreateCatResponse,
  DeleteCatResponse,
  UpdateCatRequest,
  UserCat,
};
