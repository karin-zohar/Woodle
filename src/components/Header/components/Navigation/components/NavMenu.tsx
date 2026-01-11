import type { FC } from "react";
import {
  HomeIcon,
  QuestionIcon,
  SettingsIcon,
} from "../../../../../../libs/ui/icons";
import { Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

type NavMenuProps = {
  layout: "horizontal" | "vertical";
  closeDrawer?: () => void;
};

type MenuItem = Required<MenuProps>["items"][number];

const NavMenu: FC<NavMenuProps> = ({ layout, closeDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      key: "/",
      icon: <HomeIcon />,
      onClick: () => console.log("home clicked"),
    },
    {
      label: "Settings",
      key: "settings",
      icon: <SettingsIcon />,
    },
    {
      label: "How To Play",
      key: "how-to-play",
      icon: <QuestionIcon />,
    },
  ];

  const handleItemClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
    closeDrawer?.();
  };

  return (
    <Menu
      items={menuItems}
      mode={layout}
      className="menu"
      onClick={handleItemClick}
      selectedKeys={[location.pathname]}
    />
  );
};

export default NavMenu;
