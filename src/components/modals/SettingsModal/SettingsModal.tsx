import useStore from "@/store/store";
import { Divider, Flex, Switch } from "antd";
import WordLengthSetting from "./components/WordLengthSetting/WordLengthSetting";
import "./settings-modal.style.css";

const SettingsModal = () => {
  const { theme, setTheme } = useStore();

  const onChangeTheme = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <>
      <Flex className="setting setting-theme" align="center" gap={20}>
        <Switch checked={theme === "light"} onChange={onChangeTheme} />
        <span style={{ textTransform: "capitalize" }}>{`${theme} theme`}</span>
      </Flex>

      <Divider />
      <WordLengthSetting />
    </>
  );
};

export default SettingsModal;
