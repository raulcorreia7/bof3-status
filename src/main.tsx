// Entry point: fetch the published report.json, build the model and draw the page.

import { render } from "solid-js/web";
import { modelFromReport } from "./model/report.ts";
import { HEAD, SITE } from "./strings.ts";
import "./styles/app.css";
import { App } from "./views/App.tsx";

const host = document.getElementById("page");

async function start(): Promise<void> {
  if (!host) return;
  // Fetch the chart chunk while the report downloads; the charts mount as soon as it is in.
  void import("./charts/canvas.ts");
  try {
    // Vite serves data/report.json in dev and copies it next to the page in the build.
    const response = await fetch("report.json");
    if (!response.ok) {
      throw new Error(`report.json: ${response.status} ${response.statusText}`.trim());
    }
    const model = modelFromReport(await response.json());
    host.replaceChildren();
    render(() => <App model={model} />, host);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    host.replaceChildren();
    const page = document.createElement("div");
    page.className = "mx-auto max-w-5xl px-4 pt-5 pb-16";
    const title = document.createElement("h1");
    title.className = "text-2xl leading-tight font-bold";
    title.textContent = HEAD.title;
    const card = document.createElement("div");
    card.className = "card mt-6";
    const heading = document.createElement("h2");
    heading.className = "text-xl font-semibold";
    heading.textContent = SITE.loadFailedTitle;
    const detail = document.createElement("p");
    detail.className = "mt-1 text-sm text-mute";
    detail.textContent = SITE.loadFailedDetail(message);
    const help = document.createElement("p");
    help.className = "mt-2 text-sm";
    const reload = document.createElement("a");
    reload.className = "link";
    reload.href = "";
    reload.textContent = SITE.loadFailedReload;
    const open = document.createElement("a");
    open.className = "link";
    open.href = "report.json";
    open.textContent = "report.json";
    help.append(reload, SITE.loadFailedOpen, open, SITE.loadFailedEnd);
    const picture = document.createElement("p");
    picture.className = "mt-2 text-sm text-mute";
    const image = document.createElement("a");
    image.className = "link";
    image.href = "progress.png";
    image.textContent = "progress.png";
    picture.append(SITE.loadFailedPicture, image);
    card.append(heading, detail, help, picture);
    page.append(title, card);
    host.append(page);
  }
}

void start();
