import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { Keyboard } from "react-native";

const KEYBOARD_DISMISS_DELAY_MS = 250;

const presentBottomSheet = (ref: RefObject<BottomSheetModal | null>) => {
  Keyboard.dismiss();

  setTimeout(() => {
    ref.current?.present();
  }, KEYBOARD_DISMISS_DELAY_MS);
};

export { presentBottomSheet };
