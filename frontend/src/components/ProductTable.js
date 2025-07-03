import React from "react";

function ProductTable({ model, products }) {
  const now = new Date().toLocaleString("hr-HR");
  return (
    <div>
      <h3>Model: {model}</h3>
      <table border="1" cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Ime proizvoda</th>
            <th>Webshop</th>
            <th>SKU</th>
            <th>Cijena</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={idx}>
              <td>{p.naziv}</td>
              <td>{p.webshop}</td>
              <td>{p.sku}</td>
              <td>{p.cijena}</td>
              <td>
                <a href={p.url} target="_blank" rel="noopener noreferrer">Otvori</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: "#555" }}>Izvješće generirano: {now}</p>
    </div>
  );
}

export default ProductTable;
