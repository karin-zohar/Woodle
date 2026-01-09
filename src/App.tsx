import MainLayout from "./components/MainLayout/MainLayout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <MainLayout>
      <h3>hello world</h3>

      <HomePage guessAmount={0} />
    </MainLayout>
  );
}

export default App;
