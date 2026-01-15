import { useState } from "react";
import { useWindowSize } from "react-use";
import NavContent from "./components/NavContent.tsx";
import NavDrawer from "./components/NavDrawer.tsx";

const NARROW_SCREEN_WIDTH = 700;

const Navigation = () => {
  const { width: windowWidth } = useWindowSize();

  const isTopNav = windowWidth > NARROW_SCREEN_WIDTH;
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  const navDrawerApi = {
    open: isNavDrawerOpen,
    onOpen: () => {
      setIsNavDrawerOpen(true);
    },
    onClose: () => {
      setIsNavDrawerOpen(false);
    },
  };

  return (
    <div className="navigation">
      {isTopNav ? (
        <NavContent layout={"horizontal"} />
      ) : (
        <NavDrawer {...navDrawerApi} />
      )}
    </div>
  );
};

export default Navigation;
