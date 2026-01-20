type UseConfirmActionProps = {
  eventName: string;
};

const useConfirmAction = ({ eventName }: UseConfirmActionProps) => {
  const confirm = (onConfirm: () => void) => {
    const handler = () => {
      onConfirm();
      window.removeEventListener(eventName, handler);
    };

    window.addEventListener(eventName, handler, { once: true });
  };

  return { confirm };
};

export default useConfirmAction;
