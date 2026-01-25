import { lazy } from "react";
import { type RouteObject } from "react-router";

const HomePage = lazy(async () => await import("@/pages/HomePage/HomePage"));
const GamePlayPage = lazy(
  async () => await import("@/pages/GamePlayPage/GamePlayPage")
);
const HowToPlayPage = lazy(
  async () => await import("@/pages/HowToPlayPage/HowToPlayPage")
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/play",
    element: <GamePlayPage />,
  },
  {
    path: "/how-to-play",
    element: <HowToPlayPage />,
  },
  {
    path: "/404",
    element: <span>404</span>,
  },
];

export default routes;
