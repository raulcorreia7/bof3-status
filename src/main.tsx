import { render } from "solid-js/web";
import { loadReport } from "./load.ts";
import "./styles/app.css";
import { App } from "./views/App.tsx";
import { LoadError } from "./views/LoadError.tsx";

const host = document.getElementById("page");

async function start(): Promise<void> {
  if (!host) return;
  void import("./charts/canvas.ts");
  const loaded = await loadReport();
  host.replaceChildren();
  render(
    () => (loaded.ok ? <App model={loaded.value} /> : <LoadError error={loaded.error} />),
    host,
  );
}

void start();
