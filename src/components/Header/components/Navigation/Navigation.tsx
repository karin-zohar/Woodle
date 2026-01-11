import { useState } from "react";
import { useWindowSize, useWindowScroll } from "react-use";
import NavContent from "./components/NavContent.tsx";
import NavDrawer from "./components/NavDrawer.tsx";

const NARROW_SCREEN_WIDTH = 1000;

const Navigation = () => {
  const { width: windowWidth } = useWindowSize();
  const { y: scrollY } = useWindowScroll();

  const isTopNav = windowWidth > NARROW_SCREEN_WIDTH && scrollY === 0;
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
