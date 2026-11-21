import type { LoadError as Failure } from "../load.ts";
import { HEAD, SITE } from "../strings.ts";

export function LoadError(props: { error: Failure }) {
  return (
    <div class="mx-auto max-w-5xl px-4 pt-5 pb-16">
      <h1 class="text-2xl leading-tight font-bold">{HEAD.title}</h1>
      <div class="card mt-6">
        <h2 class="text-xl font-semibold">{SITE.loadFailedTitle}</h2>
        <p class="mt-1 text-sm text-mute">{SITE.loadFailedDetail(props.error.message)}</p>
        <p class="mt-2 text-sm">
          <a class="link" href="">{SITE.loadFailedReload}</a>
          {SITE.loadFailedOpen}
          <a class="link" href="report.json">report.json</a>
          {SITE.loadFailedEnd}
        </p>
        <p class="mt-2 text-sm text-mute">
          {SITE.loadFailedPicture}
          <a class="link" href="progress.png">progress.png</a>
        </p>
      </div>
    </div>
  );
}
