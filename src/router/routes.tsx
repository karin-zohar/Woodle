import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const HomePage = lazy(async () => await import("@/pages/HomePage"));
const GamePlayPage = lazy(
  async () => await import("@/pages/GamePlayPage/GamePlayPage")
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage guessAmount={0} />,
  },
  {
    path: "/play",
    element: <GamePlayPage />,
  },
  //   TODO: add 404 page
];

export default routes;
