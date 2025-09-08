import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import '../css/home.css';

function Clients(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      const res = await fetch('/api/clients',{headers:{Accept:'application/json'}});
      const data = await res.json();
      setItems(Array.isArray(data?.data) ? data.data : []);
      setLoading(false);
    })();
  },[]);

  return (
    <div className="home-wrap">
      <Navbar />
      <main className="container">
        <div className="title-row">
          <h1>Clientes</h1>
          <a className="btn" href="/clients/create">+ Novo cliente</a>
        </div>

        <section className="panel" style={{marginTop:16}}>
          <div className="panel-head"><h2>Lista</h2></div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>Email</th><th>Telefone</th><th></th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="muted">Carregando...</td></tr>
                ) : items.length===0 ? (
                  <tr><td colSpan="4" className="muted">Nenhum registro.</td></tr>
                ) : items.map(c=>(
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td className="muted">{c.email || '-'}</td>
                    <td>{c.phone || '-'}</td>
                    <td className="action"><a className="link" href={`/clients/${c.id}/edit`}>Editar</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById('app')).render(<Clients />);