const BASE_URL = '/api';

let _categoriesCache = null;

export async function fetchCategories() {
  if (_categoriesCache) return _categoriesCache;
  
  try {
    const [res, tilesRes] = await Promise.all([
      fetch(`${BASE_URL}/categories`),
      fetch(`${BASE_URL}/tiles`)
    ]);

    if (!res.ok) throw new Error('Failed to fetch categories');
    if (!tilesRes.ok) throw new Error('Failed to fetch tiles');

    const [categories, tiles] = await Promise.all([
      res.json(),
      tilesRes.json()
    ]);

    // Map DB categories to the structure frontend expects (with items)
    _categoriesCache = categories.map(cat => ({
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
    return _categoriesCache;
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

