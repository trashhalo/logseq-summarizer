import "@logseq/libs";
import PromiseWorker from "promise-worker";
import InlineWorker from "./worker.js?worker&inline";
import wheels from "./wheels";

const showError = (err) => {
  logseq.App.showMsg(err.toString(), "error");
};

const settingsSchema = [
  {
    key: "language",
    type: "string",
    title: "Language to use for summaries",
    description:
      "What language do you want to default to when summarizing text?",
    default: "english",
  },
  {
    key: "numberOfSentences",
    type: "string",
    title: "Number of sentences",
    description:
      "How many sentences do you want to generate when you summarize content?",
    default: 3,
  },
];

let worker;
async function main() {
  worker = new PromiseWorker(new InlineWorker());

  await worker.postMessage({
    type: "init",
    urls: {
      pyodide: logseq.resolveResourceFullUrl("pyodide/pyodide.js"),
      punkt: logseq.resolveResourceFullUrl("punkt.zip"),
    },
    wheels: wheels.map((wheel) =>
      logseq.resolveResourceFullUrl(`wheels/${wheel}`)
    ),
  });

  logseq.Editor.registerSlashCommand("Summary", async () => {
    try {
      const { language, numberOfSentences } = logseq.settings;
      const { content, uuid } = await logseq.Editor.getCurrentBlock();
      const summary = await worker.postMessage({
        language,
        count: numberOfSentences,
        text: content,
      });

      await logseq.Editor.updateBlock(uuid, summary[0]);
      await logseq.Editor.insertBatchBlock(
        uuid,
        summary.slice(1).map((c) => {
          return { content: c };
        }),
        { sibling: true }
      );
    } catch (err) {
      showError(err);
    }
  });
}

logseq.beforeunload(() => {
  if (worker) {
    worker._worker.terminate();
    worker = null;
  }
});

logseq.useSettingsSchema(settingsSchema);
logseq.ready(main).catch(showError);
