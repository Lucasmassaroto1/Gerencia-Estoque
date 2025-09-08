import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./includes/navbar.jsx";
import '../css/home.css';

function Sales(){
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    setLoading(true);
    const res = await fetch(`/api/sales?date=${date}`, { headers:{Accept:'application/json'}});
    const data = await res.json();
    setItems(Array.isArray(data?.data)? data.data : []);
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  const total = items.reduce((acc, s)=> acc + (s.total||0), 0);

  return (
    <div className="home-wrap">
      <Navbar />
      <main className="container">
        <div className="title-row">
          <h1>Vendas</h1>
          <a className="btn" href="/sales/create">+ Nova venda</a>
        </div>

        <div style={{marginTop:12, display:'flex', gap:8, alignItems:'center'}}>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          <button className="btn" onClick={load}>Filtrar</button>
          <div className="badge">Total do dia: R$ {total.toFixed(2).replace('.',',')}</div>
        </div>

        <section className="panel" style={{marginTop:16}}>
            <div className="panel-head"><h2>Lista</h2></div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Cliente</th><th>Total</th><th>Status</th><th>Data</th><th></th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="muted">Carregando...</td></tr>
                  ) : items.length===0 ? (
                    <tr><td colSpan="6" className="muted">Nenhuma venda.</td></tr>
                  ) : items.map(s=>(
                    <tr key={s.id}>
                      <td>#{s.id}</td>
                      <td>{s.client}</td>
                      <td>R$ {s.total.toFixed(2).replace('.',',')}</td>
                      <td>{s.status}</td>
                      <td className="muted">{s.created_at}</td>
                      <td className="action"><a className="link" href={`/sales/${s.id}`}>Ver</a></td>
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

createRoot(document.getElementById('app')).render(<Sales />);
