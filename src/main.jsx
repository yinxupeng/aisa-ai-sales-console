import React from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./app.css";
import App from "./App.jsx";

const rootElement = document.getElementById("root");

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ margin: 24, padding: 16, border: "1px solid #ffd6d6", borderRadius: 8, background: "#fff1f0", color: "#a8071a" }}>
          <h3 style={{ margin: 0, marginBottom: 8, color: "#a8071a" }}>页面运行时异常</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{String(this.state.error?.stack || this.state.error?.message || this.state.error)}</pre>
          {this.state.info?.componentStack ? <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.8 }}>{this.state.info.componentStack}</pre> : null}
        </div>
      );
    }
    return this.props.children;
  }
}

function showRuntimeError(error) {
  if (!rootElement) return;
  rootElement.innerHTML = `<pre style="margin:24px;padding:16px;border:1px solid #ffd6d6;border-radius:8px;background:#fff1f0;color:#a8071a;white-space:pre-wrap;">${String(error?.stack || error?.message || error)}</pre>`;
}

window.addEventListener("error", (event) => {
  if (event.error) {
    showRuntimeError(event.error);
  }
});
window.addEventListener("unhandledrejection", (event) => showRuntimeError(event.reason));

try {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  showRuntimeError(error);
}
