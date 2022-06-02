importScripts("https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js");
import registerPromiseWorker from "promise-worker/register";
import summarize_py from "./summarize.py?raw";

async function main() {
  let pyodide = await loadPyodide();
  await pyodide.loadPackage("nltk");
  await pyodide.loadPackage("numpy");
  await pyodide.loadPackage("micropip");
  pyodide.globals.set(
    "docopts_url",
    "https://trashhalo.github.io/wheels/docopt-0.6.2-py2.py3-none-any.whl"
  );
  pyodide.globals.set(
    "breadability_url",
    "https://trashhalo.github.io/wheels/breadability-0.1.20-py2.py3-none-any.whl"
  );
  return pyodide.runPythonAsync(summarize_py);
}

const summarize_promise = main();

registerPromiseWorker(async (message) => {
  const summarize = await summarize_promise;
  return summarize(message.language, message.count, message.text);
});
