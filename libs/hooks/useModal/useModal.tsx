import { useLocation, useNavigate } from "react-router-dom";

const useModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const updateUrl = (params: URLSearchParams) => {
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true },
    );
  };

  const openModal = (key: string) => {
    const params = new URLSearchParams(location.search);
    params.set(key, "true");
    updateUrl(params);
  };

  const closeModal = (key: string) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    updateUrl(params);
  };

  // Batch update modals.
  //  Example: patchModalParams({ 'settings': false, 'end-game': true })

  const patchModalParams = (updates: Record<string, boolean>) => {
    const params = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, shouldOpen]) => {
      if (shouldOpen) {
        params.set(key, "true");
      } else {
        params.delete(key);
      }
    });

    updateUrl(params);
  };

  return { openModal, closeModal, patchModalParams };
};

export type UseModalReturn = ReturnType<typeof useModal>;
export type PatchModalParams = UseModalReturn['patchModalParams'];

export default useModal;
