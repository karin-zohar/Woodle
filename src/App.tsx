import { BrowserRouter as Router, useRoutes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntApp } from "antd";
import MainLayout from "./components/MainLayout/MainLayout";
import routes from "./router/routes";
import ModalRender from "./components/ModalRender/ModalRender";
import { ToastProvider } from "./providers/Toast";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* <AntApp message={{ maxCount: 1 }}> */}
          <ToastProvider>
            <ModalRender />
            <MainLayout>
              <AppRoutes />
            </MainLayout>
          </ToastProvider>
        {/* </AntApp> */}
      </Router>
    </QueryClientProvider>
  );
}

export default App;
