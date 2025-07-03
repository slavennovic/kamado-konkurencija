import React, { useState } from "react";
import ProductTable from "./components/ProductTable";

const modeli = ["Model 15", "Model 21", "Model 23", "Model 25"];

function App() {
  const [model, setModel] = useState(modeli[0]);
  const [links, setLinks] = useState(["", "", ""]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLinkChange = (i, value) => {
    const newLinks = [...links];
    newLinks[i] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProducts([]);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, links }),
      });
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      alert("Greška pri dohvaćanju podataka.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Usporedba cijena proizvoda</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <label>
          Model:
          <select value={model} onChange={e => setModel(e.target.value)} style={{ marginLeft: 10 }}>
            {modeli.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <div style={{ margin: "20px 0" }}>
          {[0,1,2].map(i => (
            <div key={i}>
              <input
                type="url"
                placeholder={`Unesi link ${i+1}`}
                value={links[i]}
                onChange={e => handleLinkChange(i, e.target.value)}
                style={{ width: "90%", marginBottom: 8 }}
                required={i === 0}
              />
            </div>
          ))}
        </div>
        <button type="submit" disabled={loading}>Kreiraj tablicu</button>
      </form>
      {loading && <p>Učitavanje...</p>}
      {products.length > 0 && <ProductTable model={model} products={products} />}
    </div>
  );
}

export default App;
