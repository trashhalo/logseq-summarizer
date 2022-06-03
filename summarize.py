from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals
from js import fetch
import numpy as np
from pathlib import Path
import zipfile
from pyodide import to_js

# Snagged from https://github.com/pyodide/pyodide/issues/1798#issuecomment-968370996
# Need to download the nltk dataset. Expects it to be in the file system. I believe this
# is holding it in memory
response = await fetch(punkt_url)
js_buffer = await response.arrayBuffer()
py_buffer = js_buffer.to_py()
stream = py_buffer.tobytes()
d = Path("/nltk_data/tokenizers")
d.mkdir(parents=True, exist_ok=True)
Path('/nltk_data/tokenizers/punkt.zip').write_bytes(stream)
zipfile.ZipFile('/nltk_data/tokenizers/punkt.zip').extractall(
    path='/nltk_data/tokenizers/'
)

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

def summarize(language, count, text):
  parser = PlaintextParser.from_string(text, Tokenizer(language))
  stemmer = Stemmer(language)

  summarizer = Summarizer(stemmer)
  summarizer.stop_words = get_stop_words(language)

  result = []
  for sentence in summarizer(parser.document, count):
    result.append(sentence.__str__())
  return to_js(result)

summarize