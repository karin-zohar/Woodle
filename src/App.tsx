import MainLayout from "./components/MainLayout/MainLayout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <MainLayout>
      <HomePage guessAmount={0} />
    </MainLayout>
  );
}

export default App;
