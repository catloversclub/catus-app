import { useCreateCatMutation } from "@/api/domains/cat/queries";
import { CreateCatRequest } from "@/api/domains/cat/types";

export const useCreateCat = () => {
  const { mutateAsync: createCat, isPending } = useCreateCatMutation();

  const submit = async (catData: CreateCatRequest) => {
    return await createCat(catData);
  };

  return { submit, isPending };
};
