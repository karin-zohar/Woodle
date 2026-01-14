import { BrowserRouter as Router, useRoutes } from "react-router";
import MainLayout from "./components/MainLayout/MainLayout";
import routes from "./router/routes";
import SettingsPage from "./pages/SettingsPage/SettingsPage";

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <Router>
      <SettingsPage />
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
