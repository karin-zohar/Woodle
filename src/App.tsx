import { BrowserRouter as Router, useRoutes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
        <ToastProvider>
          <ModalRender />
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </ToastProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
