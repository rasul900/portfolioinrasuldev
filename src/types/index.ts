export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  year: number;
  tech: string[];
  image: string;
  video?: string;
  github?: string;
  demo?: string;
  problem: string;
  solution: string;
  result: string;
  metrics: { label: string; value: number; suffix?: string }[];
  gallery: string[];
}

export interface Product {
  _id?: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  currency: string;
  images: string[];
  model3d?: string;
  category: string;
  sizes: { label: string; stock: number }[];
  colors: { name: string; hex: string; image?: string }[];
  badge?: "New" | "Sale" | "Limited";
  stock: number;
  reviews: Review[];
  featured?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  _id?: string;
  orderId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  customer: CustomerInfo;
  paymentMethod: string;
  receiptUrl?: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CustomerInfo {
  fullName: string;
  phone: string;
  telegram: string;
  country: string;
  city: string;
  region: string;
  address: string;
  postalCode: string;
  notes?: string;
}

export interface TimelineItem {
  id: string;
  role: string;
  company: string;
  period: string;
  achievements: string[];
}

export interface Skill {
  name: string;
  color: string;
  accentDark: string;
  icon: string;
  proficiency: number;
  years: number;
  projects: number;
  description: string;
  featured?: boolean;
}

export interface ServiceTier {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}
