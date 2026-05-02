// hooks/use-nickname-check.ts
import { useCheckNicknameQuery } from "@/api/domains/user/queries";
import { useState } from "react";

export const useNicknameCheck = () => {
  const [nickname, setNickname] = useState("");
  const [checkedNickname, setCheckedNickname] = useState("");

  const { data } = useCheckNicknameQuery(nickname, !!nickname.trim());

  const hasChecked = checkedNickname.length > 0;
  const isValidNickname = data?.available ?? false;
  const isDirty = nickname !== checkedNickname;

  const statusText =
    !hasChecked || isDirty
      ? "중복 여부를 확인해주세요"
      : isValidNickname
        ? "사용할 수 있는 닉네임이에요"
        : "다른 집사가 이미 사용하고 있는 닉네임이에요";

  const handleChangeNickname = (text: string) => {
    setNickname(text);
    setCheckedNickname("");
  };

  const confirmCheck = () => setCheckedNickname(nickname);

  return {
    nickname,
    hasChecked,
    isValidNickname,
    isDirty,
    statusText,
    handleChangeNickname,
    confirmCheck,
  };
};
