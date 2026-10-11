export type DayHours = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type ThemeId = "papir" | "nat" | "filt";

export type Site = {
  name: string;
  tagline: string;
  about: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
  heroImage: string;
  logoImage: string;
  backdrop: string;
  theme: ThemeId;
  hours: DayHours[];
  hoursNote: string;
  pricesNote: string;
  pricesLive: boolean;
  calendarLive: boolean;
};

export type PubEvent = {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  image: string;
};

export type Price = {
  id: number;
  category: string;
  name: string;
  priceKr: number;
  note: string;
  sort: number;
};

export type Media = {
  id: number;
  kind: "image" | "video";
  src: string;
  caption: string;
  sort: number;
};

export type StaffMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  sort: number;
};

export type PubData = {
  site: Site;
  events: PubEvent[];
  prices: Price[];
  gallery: Media[];
  staff: StaffMember[];
  today: string;
  weekday: string;
  openNow: boolean;
};

export type EditorRole = "ledig" | "ejer" | "redaktor" | "anden";

export type EditorLogin = {
  userId: string;
  name: string;
  email: string;
};

export type AuditEntry = {
  id: number;
  userName: string;
  area: string;
  detail: string;
  createdAt: string;
};

export type EditorData = PubData & {
  role: EditorRole;
  durable: boolean;
  editors: EditorLogin[];
  log: AuditEntry[];
};
