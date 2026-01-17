import { useLocation } from "react-router";
import useStore from "@/store/store";
import GenModal from "@/libs/ui/components/GenModal/GenModal";
import SettingsModal from "../modals/SettingsModal/SettingsModal";

const MODAL_CONFIGS = [
  {
    key: "settings",
    queryParam: "settings",
    title: "Settings",
    className: "settings-modal",
    content: <SettingsModal />,
  },
];

const ModalRender = () => {
  const { theme } = useStore();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const activeModal = MODAL_CONFIGS.find(
    (config) => queryParams.get(config.queryParam) === "true",
  );

  if (!activeModal) {
    return null;
  }

  return (
    <GenModal
      key={activeModal.key}
      queryParam={activeModal.queryParam}
      title={activeModal.title}
      theme={theme}
      className={activeModal.className}
    >
      {activeModal.content}
    </GenModal>
  );
};

export default ModalRender;
