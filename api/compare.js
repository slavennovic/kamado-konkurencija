const axios = require('axios');

module.exports = async (req, res) => {
  const url = 'https://webscraper.io/test-sites';
  try {
    const response = await axios.get(url);
    res.status(200).send(response.data); // Vrati sirovi HTML sadržaj
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
