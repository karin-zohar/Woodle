import { useLocation, useNavigate } from "react-router";
import { Divider, Flex, Modal, Switch, Typography } from "antd";
import useStore from "@/store/store";
import WordLengthSetting from "./components/WordLengthSetting/WordLengthSetting";
import clsx from "clsx";
import "./settings-page.style.css";

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const isSettingsOpen = queryParams.get("settings") === "true";

  const { theme, setTheme } = useStore();

  const handleCloseModal = () => {
    const updatedSearchParams = new URLSearchParams(location.search);
    updatedSearchParams.delete("settings");

    navigate(
      {
        pathname: location.pathname,
        search: updatedSearchParams.toString(),
      },
      { replace: true }
    );
  };

  const onChangeTheme = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  const { Title } = Typography;

  return (
    <Modal open={isSettingsOpen} onCancel={handleCloseModal} footer={null}>
      <div className="settings-page">
        <Flex className={clsx("settings-container", "theme", theme)} vertical>
          <Title level={2} className="settings-title">
            Settings
          </Title>
          <Flex className="settings-content" vertical>
            <Flex className="setting setting-theme" align="center" gap={20}>
              <Switch checked={theme === "light"} onChange={onChangeTheme} />
              <span
                style={{ textTransform: "capitalize" }}
              >{`${theme} theme`}</span>
            </Flex>
            <Divider />
            <WordLengthSetting />
          </Flex>
        </Flex>
      </div>
    </Modal>
  );
};

export default SettingsPage;
