export const wedding = {
  groom: { name: "Shihab", fullName: "Muhammad Shihabudin", parents: "Nama orang tua akan dilengkapi" },
  bride: { name: "Lia", fullName: "Aurelia Nanda", parents: "Nama orang tua akan dilengkapi" },
  monogram: "SL",
  akad: { title: "Akad Nikah", date: "2026-12-18T08:00:00+07:00", time: "Waktu akan dikonfirmasi", venue: "Kediaman keluarga", address: "Lokasi akan dikonfirmasi", coordinates: null as null | [number, number] },
  reception: { title: "Resepsi", date: "2026-12-20T11:00:00+07:00", time: "Waktu akan dikonfirmasi", venue: "Singosari Ballroom", address: "Hotel Santika, Gresik · Lokasi menunggu konfirmasi", coordinates: null as null | [number, number] },
  gifts: [{ bank: "BNI", name: "Aurelia Nanda", number: "" }, { bank: "Bank Mandiri", name: "Muhammad Shihabudin", number: "" }],
  giftAddress: "",
  quote: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.",
};

export function countdown(date: string, now: number) {
  const seconds = Math.max(0, Math.floor((Date.parse(date) - now) / 1000));
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}
export function ticketData(id: string, name: string, category: string) {
  return JSON.stringify({ event: "SL-WEDDING-2026", guestId: id, name, category });
}
export function validateWish(name: string, message: string) {
  return name.trim().length >= 2 && name.trim().length <= 80 && message.trim().length >= 5 && message.trim().length <= 1000;
}
export function mapUrl(coordinates: [number, number] | null) {
  return coordinates ? `https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}` : null;
}