const productImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=500&auto=format&fit=crop",
];

const products = Array.from({ length: 30 }).map((_, i) => {
  const id = String(i + 1);
  const title =
    [
      "Premium Wireless Headphones",
      "Series 7 Smart Watch",
      "Pro Running Shoes",
      "Urban Leather Backpack",
      "Noise Cancelling Earbuds",
      "Fitness Band",
      "Wireless Charger",
      "Portable Speaker",
      "Smart Lamp",
      "Bluetooth Keyboard",
    ][i % 10] + ` #${id}`;
  const price = (Math.round((20 + Math.random() * 480) * 100) / 100).toFixed(2);
  const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];
  return {
    id,
    title,
    price: `${price} €`,
    priceNumber: Number(price),
    currency: "€",
    image: productImages[i % productImages.length],
    category: categories[i % categories.length],
    rating: Math.round((3 + Math.random() * 2) * 10) / 10,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    new: i % 7 === 0,
  };
});

export default products;
