const useConfirmAction = () => {
  const confirm = (onConfirm: () => void) => {
    const handler = () => {
      onConfirm();
      window.removeEventListener("CONFIRM_END_GAME", handler);
    };
    window.addEventListener("CONFIRM_END_GAME", handler, { once: true });
  };

  return { confirm };
};

export default useConfirmAction;
