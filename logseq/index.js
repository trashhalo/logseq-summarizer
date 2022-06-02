import "@logseq/libs";
import createWorker from "@summarizer/worker";

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

function main() {
  worker = createWorker();

  logseq.Editor.registerSlashCommand("Summary", async () => {
    try {
      console.log("settings", logseq.settings);
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
