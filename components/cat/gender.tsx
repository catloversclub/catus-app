import { Gender } from "@/api/domains/cat/types";
import FemaleIcon from "@/assets/icons/female.svg";
import MaleIcon from "@/assets/icons/male.svg";
import React from "react";

interface GenderIconProps {
  gender: Gender;
}

const ICON_SIZE = 16;

const iconConfig = {
  width: ICON_SIZE,
  height: ICON_SIZE,
};

const GenderIcon = ({ gender }: GenderIconProps) => {
  return (
    <>
      {gender === "MALE" && <MaleIcon {...iconConfig} />}
      {gender === "FEMALE" && <FemaleIcon {...iconConfig} />}
    </>
  );
};

export default GenderIcon;
