import { Gender } from "@/store/auth/onboarding-store";

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

export type GetMyCatsResponse = Cat[];

export type GetCatByIdResponse = Cat;

export type UpdateCatResponse = Cat;

export { Cat, CreateCatRequest, CreateCatResponse, UpdateCatRequest };
