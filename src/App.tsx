import { BrowserRouter as Router, useRoutes } from "react-router";
import MainLayout from "./components/MainLayout/MainLayout";
import routes from "./router/routes";
import ModalRender from "./components/ModalRender/ModalRender";

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <Router>
      <ModalRender />
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
