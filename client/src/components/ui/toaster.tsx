import {
  createToaster,
  ToastCloseTrigger,
  ToastDescription,
  ToastIndicator,
  ToastRoot,
  ToastTitle,
  Toaster as ChakraToaster,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
});

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <ToastRoot key={toast.id}>
          <ToastIndicator />
          <ToastTitle />
          <ToastDescription />
          <ToastCloseTrigger />
        </ToastRoot>
      )}
    </ChakraToaster>
  );
}
