import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Copy, Gift, MapPin, Building2, Landmark, Move3D } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { OpeningGate } from "@/components/wedding/gate";
import { Monogram, Divider, PageHeading, Countdown } from "@/components/wedding/shared";
import { Ticket } from "@/components/wedding/ticket";
import { Wishes } from "@/components/wedding/wishes";
import { wedding, mapUrl } from "@/lib/wedding-config";
import backdrop from "@/assets/wedding-backdrop.png.asset.json";
import couple from "@/assets/couple-illustration.png.asset.json";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({ meta: [
    { title: "The Wedding of Shihab & Lia — 18 & 20 Desember 2026" },
    { name: "description", content: "Dengan penuh cinta, Shihab dan Lia mengundang Anda merayakan awal perjalanan bersama pada 18 dan 20 Desember 2026." },
    { property: "og:title", content: "The Wedding of Shihab & Lia" },
    { property: "og:description", content: "Sebuah awal, untuk selamanya. Buka undangan pernikahan kami, 18 & 20 Desember 2026." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Invitation,
});

const pages = ["Sampul", "Mempelai", "Acara", "Tiket", "Ucapan", "Kado"];

function Invitation() {
  const [page, setPage] = useState(0); const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState("Bapak / Ibu / Saudara/i"); const [photo, setPhoto] = useState<string | null>(null);
  const [sensor, setSensor] = useState(false); const tilt = useRef({ x: 0, y: 0 }); const art = useRef<HTMLImageElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null); const reduced = useReducedMotion();
  useEffect(() => { setGuest(new URLSearchParams(window.location.search).get("to")?.slice(0, 80) || "Bapak / Ibu / Saudara/i"); return () => { if (timer.current) clearTimeout(timer.current); }; }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.target as HTMLElement).matches("input,textarea")) return; if (e.key === "ArrowRight") setPage(p => Math.min(5, p + 1)); if (e.key === "ArrowLeft") setPage(p => Math.max(0, p - 1)); };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => { if (!sensor || reduced) return; const handler = (e: DeviceOrientationEvent) => { tilt.current = { x: (e.gamma || 0) / 8, y: (e.beta || 0) / 15 }; if (art.current) art.current.style.transform = `scale(1.04) translate(${tilt.current.x}px, ${tilt.current.y}px)`; }; window.addEventListener("deviceorientation", handler); return () => window.removeEventListener("deviceorientation", handler); }, [sensor, reduced]);
  function change(next: number) { setPage(Math.max(0, Math.min(5, next))); window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" }); }
  function openInvitation() { if (open) return; setOpen(true); timer.current = setTimeout(() => change(1), reduced ? 100 : 1700); }
  async function enableSensor() {
    const orientation = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    try { if (orientation.requestPermission && await orientation.requestPermission() !== "granted") { toast.error("Izin gerakan perangkat tidak diberikan."); return; } setSensor(s => !s); toast.success(sensor ? "Perspektif perangkat dinonaktifkan" : "Perspektif perangkat diaktifkan"); } catch { toast.error("Sensor tidak tersedia; gerakan mouse tetap aktif."); }
  }
  async function copy(value: string) { try { await navigator.clipboard.writeText(value); toast.success("Berhasil disalin"); } catch { toast.error("Belum dapat menyalin. Silakan salin secara manual."); } }
  return <main className="invitation" onMouseMove={e => { if (!sensor && !reduced && art.current) art.current.style.transform = `scale(1.025) translate(${(e.clientX / window.innerWidth - .5) * 10}px, ${(e.clientY / window.innerHeight - .5) * 8}px)`; }}>
    <img className="backdrop-art" src={backdrop.url} alt="" ref={art} />
    <header className="topbar"><div className="wordmark"><Monogram /><span>Shihab & Lia</span></div><span className="top-date">18 & 20 DESEMBER 2026</span></header>
    <AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45 }}>
      {page === 0 && <section className="cover"><span className="cover-aside left">Dua hati. Satu perjalanan.</span><span className="cover-aside right">Sebuah awal, untuk selamanya.</span><Monogram /><p className="eyebrow">THE WEDDING OF</p><h1 className="couple-names">Shihab & Lia</h1><p className="cover-date">18 & 20 Desember 2026</p><div className="gate-wrap"><OpeningGate open={open} onOpen={openInvitation} /><Button variant="seal" onClick={openInvitation} disabled={open} aria-label="Buka Undangan">{open ? "DENGAN CINTA" : "BUKA UNDANGAN"}</Button></div><p className="guest-greeting">Kepada Yth.<strong>{guest}</strong></p></section>}
      {page === 1 && <section className="content-section"><PageHeading eyebrow="BISMILLAHIRRAHMANIRRAHIM" title="Dengan Cinta, Kami Mengundang" /><div className="opening-quote">“{wedding.quote}”<small>QS. AR-RUM : 21</small></div><div className="couple-grid">{[wedding.groom, wedding.bride].map((person, i) => <article className="couple-person" key={person.name}><Button variant="ghost" className={`portrait-button ${i === 0 ? "groom-photo" : "bride-photo"}`} onClick={() => setPhoto(person.fullName)} aria-label={`Lihat foto ${person.name}`}><img src={couple.url} alt={`Ilustrasi ${person.name}`} /></Button><h3>{person.fullName}</h3><p>Putra / putri tercinta dari<br />{person.parents}</p></article>)}</div><Divider /><h3 className="story-heading">Cerita Kami</h3><p className="section-intro">Dari sebuah pertemuan, tumbuh sebuah keyakinan. Kini, dengan restu keluarga, kami melangkah menuju selamanya.</p><div className="gallery" onPointerDown={e => { const el = e.currentTarget; const x = e.clientX; const scroll = el.scrollLeft; const move = (ev: PointerEvent) => { if (ev.pointerType === "mouse") el.scrollLeft = scroll - (ev.clientX - x); }; el.addEventListener("pointermove", move); const cleanup = () => el.removeEventListener("pointermove", move); window.addEventListener("pointerup", cleanup, { once: true }); }}>{["Sebuah pertemuan", "Satu keyakinan", "Menuju selamanya"].map((title, i) => <Button variant="ghost" key={title} onClick={() => setPhoto(title)} aria-label={title}><img src={couple.url} alt={title} className={i === 1 ? "object-top" : "object-center"} /></Button>)}</div></section>}
      {page === 2 && <section className="content-section"><PageHeading eyebrow="HARI YANG KAMI NANTIKAN" title="Jadwal Acara" /><p className="section-intro">Dengan penuh kebahagiaan, kami menantikan kehadiran Anda.</p><Countdown /><div className="events-grid">{[wedding.akad, wedding.reception].map((event, i) => <article className="event-card" key={event.title}>{i === 0 ? <Landmark className="event-icon" /> : <Building2 className="event-icon" />}<h3>{event.title}</h3><p className="event-date">{i === 0 ? "Jumat, 18 Desember 2026" : "Minggu, 20 Desember 2026"}</p><p>{event.time}</p><h4>{event.venue}</h4><p>{event.address}</p><Button variant="gold" onClick={() => { const url = mapUrl(event.coordinates); if (url) window.open(url, "_blank", "noopener,noreferrer"); else toast.info("Lokasi acara akan dilengkapi setelah dikonfirmasi oleh mempelai."); }}><MapPin /> Buka Peta</Button>{!event.coordinates && <small>Koordinat menunggu konfirmasi</small>}</article>)}</div></section>}
      {page === 3 && <Ticket />}{page === 4 && <Wishes />}
      {page === 5 && <section className="content-section"><PageHeading eyebrow="TANDA KASIH UNTUK KAMI" title="Kado Digital" /><p className="section-intro">Kehadiran dan doa restu Anda sudah lebih dari cukup. Jika berkenan memberikan tanda kasih:</p><div className="gift-grid">{wedding.gifts.map(bank => <article className="bank-card" key={bank.bank}><Gift size={22} /><h3>{bank.bank}</h3><p>a.n. {bank.name}</p><strong>{bank.number || "Rekening akan dilengkapi"}</strong><Button variant="wedding" onClick={() => bank.number ? copy(bank.number) : toast.info("Nomor rekening belum tersedia.")}><Copy /> Salin No. Rek.</Button></article>)}</div><div className="gift-address"><h3>Alamat Pengiriman Kado</h3><p>{wedding.giftAddress || "Alamat akan dilengkapi oleh mempelai."}</p><Button variant="wedding" onClick={() => wedding.giftAddress ? copy(wedding.giftAddress) : toast.info("Alamat pengiriman belum tersedia.")}><Copy /> Salin Alamat</Button></div><Divider /><div className="closing"><Monogram /><p>Terima kasih atas cinta, doa, dan restu yang Anda berikan. Sampai bertemu di hari bahagia kami.</p><span className="eyebrow">DENGAN PENUH CINTA</span><h3 className="couple-names">Shihab & Lia</h3></div></section>}
    </motion.div></AnimatePresence>
    <nav className="bottom-nav" aria-label="Bagian undangan"><Button variant="wedding" size="icon" className="nav-arrow" disabled={page === 0} onClick={() => change(page - 1)} aria-label="Bagian sebelumnya"><ArrowLeft /></Button><div className="nav-links">{pages.map((title, i) => <Button variant="ghost" className={page === i ? "active" : ""} key={title} onClick={() => change(i)} aria-current={page === i ? "page" : undefined}><span>0{i + 1}</span>{title}</Button>)}</div><Button variant="wedding" size="icon" className="nav-arrow" disabled={page === 5} onClick={() => page === 0 ? openInvitation() : change(page + 1)} aria-label="Bagian berikutnya"><ArrowRight /></Button></nav><p className="nav-caption">Dengan cinta, untuk selamanya.</p>
    <div className="utility"><Button variant="wedding" size="icon" onClick={enableSensor} aria-label="Perspektif perangkat" title="Perspektif perangkat" aria-pressed={sensor}><Move3D /></Button></div>
    <Dialog open={photo !== null} onOpenChange={value => { if (!value) setPhoto(null); }}><DialogContent className="max-w-sm"><DialogTitle>{photo}</DialogTitle><DialogDescription>Shihab & Lia · Sebuah perjalanan cinta</DialogDescription><img src={couple.url} className="max-h-[65svh] w-full object-cover" alt={photo || "Pasangan mempelai"} /><p className="text-xs text-muted-foreground">Foto ilustrasi; foto asli mempelai akan dilengkapi.</p></DialogContent></Dialog><Toaster position="top-center" />
  </main>;
}