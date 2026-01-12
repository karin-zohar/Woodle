import { Flex, Switch } from "antd";
import useStore from "@/store/store";

const SettingsPage = () => {
  const { theme, setTheme } = useStore();
  const onChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };
  return (
    <div className="settings-page">
      <Flex className="setting setting-theme" gap={20}>
        <span>{`${theme} theme`}</span>
        <Switch defaultChecked onChange={onChange} />
      </Flex>
    </div>
  );
};

export default SettingsPage;
