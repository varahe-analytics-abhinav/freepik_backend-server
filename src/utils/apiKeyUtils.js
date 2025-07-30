function getRandomApiKey(keys) {
  if (keys.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

module.exports = { getRandomApiKey };