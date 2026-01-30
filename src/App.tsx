import { BrowserRouter as Router, useRoutes } from "react-router";
import MainLayout from "./components/MainLayout/MainLayout";
import routes from "./router/routes";
import ModalRender from "./components/ModalRender/ModalRender";
import { ToastProvider } from "./providers/Toast";

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <ModalRender />
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </ToastProvider>
    </Router>
  );
}

export default App;
