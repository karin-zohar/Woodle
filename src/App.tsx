import { BrowserRouter as Router, useRoutes } from "react-router";
import MainLayout from "./components/MainLayout/MainLayout";
import routes from "./router/routes";

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <Router>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
