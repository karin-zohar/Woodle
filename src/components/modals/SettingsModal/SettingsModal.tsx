import useStore from "@/store/store";
import { Divider, Switch } from "antd";
import WordLengthSetting from "./components/WordLengthSetting/WordLengthSetting";
import "./settings-modal.style.css";

const SettingsModal = () => {
  const { theme, setTheme } = useStore();

  const onChangeTheme = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <>
      <label className="setting setting-theme">
        <Switch checked={theme === "light"} onChange={onChangeTheme} />
        <span style={{ textTransform: "capitalize" }}>{`${theme} theme`}</span>
      </label>

      <Divider />
      <WordLengthSetting />
    </>
  );
};

export default SettingsModal;
