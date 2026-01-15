import { type FC } from "react";
import { Button, Drawer } from "antd";
import NavContent from "./NavContent";
import GenCloseButton from "@/libs/ui/components/GenCloseButton/GenCloseButton";
import clsx from "clsx";
import { MenuIcon } from "@/libs/ui/icons/index";

type NavDrawerProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const NavDrawer: FC<NavDrawerProps> = ({ open, onOpen, onClose }) => {
  return (
    <>
      <div className="open-nav-drawer-button-container">
        <Button
          className={clsx("open-nav-drawer-button", {
            "drawer-open": open,
          })}
          type="text"
          onClick={onOpen}
          icon={<MenuIcon />}
        />
      </div>
      <Drawer
        className={clsx("nav-drawer")}
        open={open}
        onClose={onClose}
        closeIcon={<GenCloseButton onClose={onClose} size="large" />}
      >
        <NavContent layout={"vertical"} closeDrawer={onClose} />
      </Drawer>
    </>
  );
};

export default NavDrawer;
