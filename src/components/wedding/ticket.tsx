import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageHeading } from "./shared";
import { ticketData } from "@/lib/wedding-config";

export function Ticket() {
  const [category, setCategory] = useState("VIP");
  const [name, setName] = useState("Tamu Undangan");
  const [id, setId] = useState("");
  const [qr, setQr] = useState("");
  const [details, setDetails] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setName(params.get("to")?.slice(0, 80) || "Tamu Undangan");
    const stored = sessionStorage.getItem("sl-guest-id") || crypto.randomUUID();
    sessionStorage.setItem("sl-guest-id", stored); setId(stored);
  }, []);
  useEffect(() => { if (!id) return; QRCode.toDataURL(ticketData(id, name, category), { width: 280, margin: 2 }).then(setQr).catch(() => setError("Tiket belum berhasil dibuat. Silakan coba lagi.")); }, [id, name, category]);
  async function download() {
    if (!qr) return;
    const canvas = document.createElement("canvas"); canvas.width = 800; canvas.height = 1100;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const styles = getComputedStyle(document.documentElement);
    ctx.fillStyle = styles.getPropertyValue("--ticket-export-bg").trim(); ctx.fillRect(0, 0, 800, 1100);
    ctx.fillStyle = styles.getPropertyValue("--ticket-export-ink").trim(); ctx.textAlign = "center";
    ctx.font = "38px Georgia"; ctx.fillText("The Wedding of", 400, 100); ctx.font = "64px Georgia"; ctx.fillText("Shihab & Lia", 400, 180);
    ctx.font = "30px Georgia"; ctx.fillText(category + " · " + name, 400, 270);
    const image = new Image(); image.src = qr; await image.decode(); ctx.drawImage(image, 200, 330, 400, 400);
    ctx.font = "24px Georgia"; ctx.fillText("18 & 20 Desember 2026", 400, 820); ctx.font = "16px monospace"; ctx.fillText(id, 400, 885);
    const link = document.createElement("a"); link.download = `Tiket-SL-${id.slice(0, 8)}.png`; link.href = canvas.toDataURL("image/png"); link.click();
  }
  return <section className="content-section"><PageHeading eyebrow="SEBUAH TEMPAT UNTUK ANDA" title="Wedding Barcode" />
    <div className="ticket-tabs">{["VIP", "Reguler"].map(c => <Button variant={category === c ? "gold" : "wedding"} onClick={() => setCategory(c)} key={c}>{c === "VIP" ? "VIP · Emas" : "Reguler · Silver"}</Button>)}</div>
    <div className={`wedding-ticket ${category === "Reguler" ? "silver-ticket" : ""}`}><span className="eyebrow">{category} PASS</span><h3>{name}</h3><div className="qr-box">{qr ? <img src={qr} alt={`Kode QR unik untuk ${name}`} /> : <p>{error || "Menyiapkan tiket…"}</p>}</div><p className="ticket-number">SL–{id.slice(0, 8).toUpperCase()}</p><p>18 & 20 Desember 2026</p><Button variant="wedding" onClick={() => setDetails(true)}><ScanLine /> Tampilkan Detail</Button></div>
    <Button variant="gold" onClick={download} disabled={!qr}><Download /> Download Tiket</Button>
    <Dialog open={details} onOpenChange={setDetails}><DialogContent><DialogTitle>Detail tiket undangan</DialogTitle><DialogDescription>Shihab & Lia · Desember 2026</DialogDescription><p>{name} · {category}</p><p className="break-all text-xs text-muted-foreground">ID tamu: {id}</p>{qr && <img className="mx-auto w-48" src={qr} alt="QR tiket" />}<Button variant="gold" onClick={download}><Download /> Download Tiket</Button></DialogContent></Dialog>
  </section>;
}