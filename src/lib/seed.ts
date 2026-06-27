import { connectDB } from "./mongodb";
import { Product, Order } from "./models";
import { products } from "@/data/products";

export async function seedDatabase() {
  await connectDB();
  if (!process.env.MONGODB_URI) {
    return { seeded: false, reason: "MONGODB_URI not set" };
  }

  for (const p of products) {
    await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        currency: p.currency,
        images: p.images,
        category: p.category,
        sizes: p.sizes,
        colors: p.colors,
        badge: p.badge,
        stock: p.stock,
        featured: p.featured,
      },
      { upsert: true, new: true }
    );
  }

  const count = await Product.countDocuments();
  return { seeded: true, products: count };
}

export async function getProductsFromDB() {
  await connectDB();
  if (!process.env.MONGODB_URI) return products;
  try {
    const docs = await Product.find().lean();
    return docs.length > 0 ? docs : products;
  } catch {
    return products;
  }
}

export async function getOrdersFromDB() {
  await connectDB();
  if (!process.env.MONGODB_URI) return [];
  try {
    return await Order.find().sort({ createdAt: -1 }).limit(100).lean();
  } catch {
    return [];
  }
}
