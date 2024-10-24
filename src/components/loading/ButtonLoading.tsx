import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "../ui/button";

export default function ButtonLoading({
  isLoading,
  buttonText,
  loadingButtonText,
  ...others
}: {
  isLoading: boolean;
  buttonText: string;
  loadingButtonText: string;
} & ButtonProps) {
  return (
    <Button disabled={isLoading} {...others}>
      {isLoading ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          {loadingButtonText}
        </>
      ) : (
        <>{buttonText}</>
      )}
    </Button>
  );
}
