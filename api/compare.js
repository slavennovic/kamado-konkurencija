// Za Vercel, Netlify, Render serverless funkciju
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');

const dummyScrape = async (url) => {
  // Ovdje ide pravi scraping - ovo je samo primjer!
  // Prilagodi selektore prema webshopu
  return {
    naziv: "Primjer proizvod",
    webshop: (new URL(url)).hostname,
    sku: "SKU123456",
    cijena: Math.floor(100 + Math.random() * 900) + " kn",
    url
  };
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { model, links } = req.body;
  if (!Array.isArray(links) || !model) {
    res.status(400).json({ error: "Neispravan zahtjev" });
    return;
  }
  // Ovdje bi išao pravi scraping za svaki link
  const products = [];
  for (const link of links.filter(Boolean)) {
    try {
      const product = await dummyScrape(link);
      product.model = model;
      products.push(product);
    } catch (e) {
      products.push({
        naziv: "Greška pri dohvaćanju",
        webshop: "-",
        sku: "-",
        cijena: "-",
        url: link
      });
    }
  }
  res.status(200).json({ products });
};
