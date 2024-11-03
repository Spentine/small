const ref = {
  "english": "./englishWords.txt",
}

const cache = {};

async function downloadWordList(link) {
  const response = await fetch(link);
  const text = await response.text();
  return text.split("\n");
}

async function fetchList(list) {
  if (!(list in cache)) {
    cache[list] = await downloadWordList(ref[list]);
  }
  return cache[list];
}

export { fetchList };