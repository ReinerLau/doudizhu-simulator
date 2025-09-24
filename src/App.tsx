import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";

/**
 * 主应用组件
 * 管理应用的路由结构
 */
function App() {
  return (
    <Routes>
      {/* 首页路由 */}
      <Route path="/" element={<HomePage />} />

      {/* 对局页面路由 - 正常模式 */}
      <Route path="/game/:gameId" element={<GamePage />} />

      {/* 对局页面路由 - 编辑模式 (预留) */}
      <Route path="/game/:gameId/edit" element={<GamePage />} />

      {/* 新增对局页面路由 (预留) */}
      <Route path="/game/new" element={<GamePage />} />
    </Routes>
  );
}

export default App;
