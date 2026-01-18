import { useLocation } from "react-router";
import useStore from "@/store/store";
import GenModal from "@/libs/ui/components/GenModal/GenModal";
import SettingsModal from "../modals/SettingsModal/SettingsModal";
import EndGameModal from "../modals/EndGameModal/EndGameModal";

const MODAL_CONFIGS = [
  {
    key: "settings",
    queryParam: "settings",
    title: "Settings",
    className: "settings-modal",
    content: <SettingsModal />,
  },
  {
    key: "end-game",
    queryParam: "end-game",
    title: "End current game?",
    content: <EndGameModal />,
  },
];

const ModalRender = () => {
  const { theme } = useStore();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Filter the configs to get all that are currently active in the URL
  const activeModals = MODAL_CONFIGS.filter(
    (config) => queryParams.get(config.queryParam) === "true"
  );

  if (activeModals.length === 0) {
    return null;
  }

  return (
    <>
      {activeModals.map((modal) => (
        <GenModal
          key={modal.key}
          queryParam={modal.queryParam}
          title={modal.title}
          theme={theme}
          className={modal.className}
        >
          {modal.content}
        </GenModal>
      ))}
    </>
  );
};

export default ModalRender;
