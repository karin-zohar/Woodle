import type { FC } from "react";
import { HomeIcon, QuestionIcon, SettingsIcon } from "@/libs/ui/icons";
import { Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "@/libs/hooks";

type NavMenuProps = {
  layout: "horizontal" | "vertical";
  closeDrawer?: () => void;
};

type MenuItem = Required<MenuProps>["items"][number];

const NavMenu: FC<NavMenuProps> = ({ layout, closeDrawer }) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      key: "/",
      icon: <HomeIcon />,
    },
    {
      label: "Settings",
      key: "/settings",
      icon: <SettingsIcon />,
    },
    {
      label: "How To Play",
      key: "/how-to-play",
      icon: <QuestionIcon />,
    },
  ];

  const handleItemClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "/settings") {
      openModal("settings");
    } else {
      navigate(key);
    }
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
