import registerPromiseWorker from "promise-worker/register";
import summarize_py from "./summarize.py?raw";

let resolveInitSummarize;
const initSummarizePromise = new Promise((resolve) => {
  resolveInitSummarize = resolve;
});

const summarizePromise = new Promise(async (resolve, reject) => {
  try {
    const init = await initSummarizePromise;
    importScripts(init.urls.pyodide);
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("nltk");
    await pyodide.loadPackage("numpy");
    pyodide.globals.set("punkt_url", init.urls.punkt);
    pyodide.globals.set("wheels", init.wheels);
    for (const wheel of init.wheels) {
      const wheelFetch = await fetch(wheel);
      const wheelBuffer = await wheelFetch.arrayBuffer();
      pyodide.unpackArchive(wheelBuffer, "whl");
    }

    resolve(pyodide.runPythonAsync(summarize_py));
  } catch (err) {
    reject(err);
  }
});

registerPromiseWorker(async (message) => {
  if (message.type === "init") {
    return resolveInitSummarize(message);
  }

  const summarize = await summarizePromise;
  return summarize(message.language, message.count, message.text);
});
