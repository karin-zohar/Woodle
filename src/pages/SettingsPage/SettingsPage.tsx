import { Flex, Switch } from "antd";
import useStore from "@/store/store";
import "./settings-page.style.css";
const SettingsPage = () => {
  const { theme, setTheme } = useStore();
  const onChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };
  return (
    <div className="settings-page">
      <Flex className="settings-container" vertical gap={20}>
        <Flex className="setting setting-theme" gap={20}>
          <span>{`${theme} theme`}</span>
          <Switch defaultChecked onChange={onChange} />
        </Flex>
      </Flex>
    </div>
  );
};

export default SettingsPage;
