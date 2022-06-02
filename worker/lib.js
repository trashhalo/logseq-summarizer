import PromiseWorker from "promise-worker";
import InlineWorker from "./worker.js?worker&inline";
export default () => new PromiseWorker(new InlineWorker());
