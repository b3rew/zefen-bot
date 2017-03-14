const URL = {
  search: "http://www.arifzefen.com/json/list/search.php?q=",
  // recent : "http://www.arifzefen.com/json/list/mostrecent.json",
  recent: "http://www.arifzefen.com/json/featured/624926.json",
  random: "http://www.arifzefen.com/json/curated/surpriseme.php",
  traditional: "http://www.arifzefen.com/json/curated/traditional.json",
  popular: "http://www.arifzefen.com/json/list/mostplayed.json",
  playSong: 'http://www.arifzefen.com/json/playSong.php?id='
}
const SEARCH_LIMIT = 25;

module.exports = {
  URL,
  SEARCH_LIMIT
};

