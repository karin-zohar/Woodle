import type { FC, ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <h1>woodle</h1>
      {children}
    </div>
  );
};

export default MainLayout;
