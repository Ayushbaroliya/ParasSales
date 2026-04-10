const BASE_URL = '/api';

export async function fetchCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const categories = await res.json();
    
    // Fetch tiles to group them into categories for the frontend expectation
    const tilesRes = await fetch(`${BASE_URL}/tiles`);
    const tiles = await tilesRes.json();

    // Map DB categories to the structure frontend expects (with items)
    return categories.map(cat => ({
      ...cat,
      items: tiles
        .filter(tile => tile.category === cat.id)
        .map(tile => ({
          id: tile._id,
          title: tile.name,
          price: tile.price,
          desc: tile.description,
          image: tile.imageUrl,
          isOutOfStock: !tile.stockStatus
        }))
    }));
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

export async function fetchCategoryById(id) {
  const data = await fetchCategories();
  const cat = data.find((c) => c.id === id);
  if (!cat) throw new Error(`Category "${id}" not found`);
  return cat;
}

export async function fetchProductById(id) {
  const data = await fetchCategories();
  for (const cat of data) {
    const item = cat.items.find((i) => i.id === id);
    if (item) return { item, category: cat };
  }
  throw new Error(`Product "${id}" not found`);
}

export async function fetchTilesGrouped() {
  return fetchCategories();
}

