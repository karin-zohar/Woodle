import { type FC } from "react";
import NavMenu from "./NavMenu.tsx";

type NavContentProps = {
  layout: "horizontal" | "vertical";
  closeDrawer?: () => void;
};

const NavContent: FC<NavContentProps> = ({ layout, closeDrawer }) => {
  return <NavMenu layout={layout} closeDrawer={closeDrawer} />;
};

export default NavContent;
