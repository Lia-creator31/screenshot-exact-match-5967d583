import { useEffect, useState } from "react";
import { Flower2 } from "lucide-react";
import { countdown, wedding } from "@/lib/wedding-config";

export function Monogram() { return <div className="monogram" aria-label="Shihab dan Lia"><span>S</span><span>L</span><Flower2 size={13} /></div>; }
export function Divider() { return <div className="ornament-divider" aria-hidden="true"><span /><Flower2 size={18} /><span /></div>; }
export function PageHeading({ eyebrow, title }: { eyebrow: string; title: string }) { return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><Divider /></header>; }
export function Countdown() {
  const [values, setValues] = useState([0, 0, 0, 0]);
  useEffect(() => { const update = () => setValues(countdown(wedding.akad.date, Date.now())); update(); const timer = setInterval(update, 1000); return () => clearInterval(timer); }, []);
  return <div className="countdown">{values.map((value, i) => <div key={i}><strong>{String(value).padStart(2, "0")}</strong><span>{["HARI", "JAM", "MENIT", "DETIK"][i]}</span></div>)}</div>;
}