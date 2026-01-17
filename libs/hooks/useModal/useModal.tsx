import { useLocation, useNavigate } from "react-router-dom";

const useModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = (key: string) => {
    const params = new URLSearchParams(location.search);
    params.set(key, "true");

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );
  };

  const closeModal = (key: string) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true },
    );
  };

  return { openModal, closeModal };
};

export default useModal;
