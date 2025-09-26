import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "virtual:uno.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
