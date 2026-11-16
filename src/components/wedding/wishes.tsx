import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Heart, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PageHeading } from "./shared";
import { validateWish } from "@/lib/wedding-config";

export function Wishes() {
  const [name, setName] = useState(""); const [message, setMessage] = useState(""); const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["wedding-wishes"], queryFn: async () => { const { data, error } = await supabase.from("wedding_wishes").select("id,name,message,created_at").order("created_at", { ascending: false }).limit(100); if (error) throw error; return data; } });
  const mutation = useMutation({ mutationFn: async () => { if (!validateWish(name, message)) throw new Error("Isi nama minimal 2 karakter dan ucapan minimal 5 karakter."); const { error } = await supabase.from("wedding_wishes").insert({ name: name.trim(), message: message.trim() }); if (error) throw error; }, onSuccess: () => { setMessage(""); queryClient.invalidateQueries({ queryKey: ["wedding-wishes"] }); toast.success("Terima kasih, ucapan Anda telah tersimpan."); }, onError: error => toast.error(error instanceof Error ? error.message : "Ucapan belum terkirim. Silakan coba lagi.") });
  return <section className="content-section"><PageHeading eyebrow="UNTAIAN CINTA DARI ANDA" title="Ucapan & Doa" /><p className="section-intro">Doa baik Anda adalah hadiah terindah bagi kami.</p>
    <form className="wishes-form" onSubmit={e => { e.preventDefault(); mutation.mutate(); }}><label htmlFor="wish-name">Nama Anda</label><input id="wish-name" required minLength={2} maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" /><label htmlFor="wish-message">Ucapan & doa</label><textarea id="wish-message" required minLength={5} maxLength={1000} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tuliskan doa terbaik Anda…" rows={4} /><Button variant="gold" disabled={mutation.isPending}><Send />{mutation.isPending ? "Mengirim…" : "Kirim Ucapan"}</Button></form>
    {query.isPending && <p>Memuat ucapan…</p>}{query.isError && <Button variant="wedding" onClick={() => query.refetch()}><RotateCcw /> Muat ulang ucapan</Button>}
    <div className="wishes-grid">{query.data?.map(wish => <article className="wish-card" key={wish.id}><Heart size={16} /><p>{wish.message}</p><strong>{wish.name}</strong></article>)}</div>{query.data?.length === 0 && <p className="section-intro">Jadilah yang pertama mengirimkan doa untuk kami.</p>}
  </section>;
}