# Logseq Summarizer

Uses [sumy](https://pypi.org/project/sumy/) to summarize long text in logseq

![demo](./public/demo.gif)

## Installation

- Download a released version assets from Github.
- Unzip it.
- Click Load unpacked plugin, and select destination directory to the unzipped folder.

## Usage

- Paste a big block of text into a block. News articles, blog posts, etc
- In the block type /Summary

## Configuration

- `language` to use to interpret the text in blocks
- `numberOfSentences` how many senetences should be generated during summary
- `replaceSourceContent` if you prefer to keep the source material set this to false and it will next summaries underneath

## Development

1. yarn
2. yarn build
3. Load the unpacked plugin from `dist`

## Pyodide

Minimal version created following these steps

1. Place full release in `public/pyodide`
2. Build plugin
3. Run the summarization function in logseq
4. Delete everything that is not the latest access time. Find by `ls -ltu`
5. Repeat 2 and 3
6. Restore files until it works

## Icon

[Data compression icons created by Eucalyp - Flaticon](https://www.flaticon.com/free-icons/data-compression)
