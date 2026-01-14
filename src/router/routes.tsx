import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const HomePage = lazy(async () => await import("@/pages/HomePage"));
const GamePlayPage = lazy(
  async () => await import("@/pages/GamePlayPage/GamePlayPage")
);
const SettingsPage = lazy(
  async () => await import("@/pages/SettingsPage/SettingsPage")
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
    path: "/settings",
    element: <SettingsPage />,
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
