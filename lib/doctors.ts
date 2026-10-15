export type Doctor = { id: string; name: string; title: string; exp: string };

export const doctors: Doctor[] = [
  { id: "meera", name: "Dr. Meera Iyer", title: "Psychiatrist", exp: "9 yrs" },
  { id: "arjun", name: "Dr. Arjun Rao", title: "Psychiatrist", exp: "12 yrs" },
  { id: "nisha", name: "Dr. Nisha Kapoor", title: "Psychiatrist", exp: "7 yrs" },
  { id: "kabir", name: "Dr. Kabir Sethi", title: "Psychiatrist", exp: "10 yrs" },
];

export const getDoctor = (id?: string | null) =>
  doctors.find((d) => d.id === id) ?? doctors[0];