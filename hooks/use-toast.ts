import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "tomatoToast";

interface ShowToastOptions {
  message: string;
  description?: string;
  type?: ToastType;
}

export function useToast() {
  const show = ({
    message,
    description,
    type = "success",
  }: ShowToastOptions) => {
    Toast.show({ type, text1: message, text2: description });
  };

  const success = (message: string, description?: string) =>
    show({ message, description, type: "success" });

  const error = (message: string, description?: string) =>
    show({ message, description, type: "error" });

  const tomato = (message: string, uuid: string) =>
    Toast.show({ type: "tomatoToast", text1: message, props: { uuid } });

  const hide = () => Toast.hide();

  return { success, error, tomato, hide };
}
