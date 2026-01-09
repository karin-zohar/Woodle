import type { FC, ReactNode } from "react";
import Header from "../Header/Header";
import "./main-layout.style.css";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
