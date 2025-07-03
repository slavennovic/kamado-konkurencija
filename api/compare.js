const axios = require('axios');
const cheerio = require('cheerio');

// Scraper za vremejenovac.rs
async function scrapeVremeJeNovac(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const $ = cheerio.load(data);

    const naziv = $('h1.product-title').text().trim() ||
                  $('h1').first().text().trim();

    let cijena = $('.product-price').first().text().trim();
    if (!cijena) {
      cijena = $('.price').first().text().trim();
    }
    if (!cijena) {
      cijena = $('[class*=price]').filter((i, el) => $(el).text().includes('RSD')).first().text().trim();
    }

    return {
      naziv,
      cijena,
      webshop: 'vremejenovac.rs',
      sku: '-',
      url
    };
  } catch (err) {
    return {
      naziv: null,
      cijena: null,
      webshop: 'vremejenovac.rs',
      sku: '-',
      url,
      error: 'Greška pri dohvaćanju podataka'
    };
  }
}

// Scraper za kamado.rs
async function scrapeKamadoRS(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const $ = cheerio.load(data);

    const naziv = $('h1').first().text().trim();

    let cijena = $('[class*=price], .product-price, .cena').first().text().trim();
    if (!cijena) cijena = "N/A";

    return {
      naziv,
      cijena,
      webshop: 'kamado.rs',
      sku: '-',
      url
    };
  } catch (err) {
    return {
      naziv: null,
      cijena: null,
      webshop: 'kamado.rs',
      sku: '-',
      url,
      error: 'Greška pri dohvaćanju podataka'
    };
  }
}

// Scraper za kamadobraai.rs
async function scrapeKamadoBraaiRS(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const $ = cheerio.load(data);

    const naziv = $('h1').first().text().trim();

    let cijena = $('[class*=price], .product-price, .cena').first().text().trim();
    if (!cijena) cijena = "N/A";

    return {
      naziv,
      cijena,
      webshop: 'kamadobraai.rs',
      sku: '-',
      url
    };
  } catch (err) {
    return {
      naziv: null,
      cijena: null,
      webshop: 'kamadobraai.rs',
      sku: '-',
      url,
      error: 'Greška pri dohvaćanju podataka'
    };
  }
}

// Glavna funkcija (Vercel/Netlify handler)
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
  const products = [];
  for (const link of links.filter(Boolean)) {
    let product;
    try {
      if (link.includes('vremejenovac.rs')) {
        product = await scrapeVremeJeNovac(link);
      } else if (link.includes('kamado.rs')) {
        product = await scrapeKamadoRS(link);
      } else if (link.includes('kamadobraai.rs')) {
        product = await scrapeKamadoBraaiRS(link);
      } else {
        product = {
          naziv: "Nepodržan webshop",
          cijena: "-",
          webshop: "-",
          sku: "-",
          url: link
        };
      }
      product.model = model;
      products.push(product);
    } catch (e) {
      products.push({
        naziv: "Greška pri dohvaćanju",
        cijena: "-",
        webshop: "-",
        sku: "-",
        model,
        url: link
      });
    }
  }
  res.status(200).json({ products });
};
