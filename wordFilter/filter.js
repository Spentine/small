import { fetchList } from "./downloader.js";

async function filterWords(regexStr, listName) {
  const wordList = await fetchList(listName);
  const regex = new RegExp(regexStr);
  
  const filtered = wordList.filter((word) => {
    return regex.test(word);
  });
  
  return filtered;
}

export { filterWords };