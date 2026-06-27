import mongoose, { Schema, models } from "mongoose";
import type { OrderStatus } from "@/types";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    items: { type: Schema.Types.Mixed, required: true },
    subtotal: Number,
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "packed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    customer: { type: Schema.Types.Mixed, required: true },
    paymentMethod: { type: String, default: "bank_transfer" },
    receiptUrl: String,
    stripePaymentId: String,
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    salePrice: Number,
    currency: { type: String, default: "UZS" },
    images: [String],
    category: String,
    sizes: [{ label: String, stock: Number }],
    colors: [{ name: String, hex: String }],
    badge: String,
    stock: { type: Number, default: 0 },
    featured: Boolean,
  },
  { timestamps: true }
);

const ContactSchema = new Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

export const Order = models.Order || mongoose.model("Order", OrderSchema);
export const Product = models.Product || mongoose.model("Product", ProductSchema);
export const Contact = models.Contact || mongoose.model("Contact", ContactSchema);

export type { OrderStatus };
