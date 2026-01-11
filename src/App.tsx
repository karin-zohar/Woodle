import MainLayout from "./components/MainLayout/MainLayout";
import GamePlayPage from "./pages/GamePlayPage/GamePlayPage";
// import HomePage from "./pages/HomePage";

function App() {
  return (
    <MainLayout>
      {/* <HomePage guessAmount={0} /> */}
      <GamePlayPage />
    </MainLayout>
  );
}

export default App;
