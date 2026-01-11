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
  {
    path: "/settings",
    element: <span>settings</span>,
  },
  {
    path: "/how-to-play",
    element: <span>how-to-play</span>,
  },
  {
    path: "/404",
    element: <span>404</span>,
  },
];

export default routes;
