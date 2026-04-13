const connectDB = require('./lib/db');
const Category = require('./models/Category');

module.exports = async (req, res) => {
  await connectDB();

  const { method } = req;
  const cookies = req.headers.cookie;
  const isAuthenticated = cookies && cookies.includes('admin_session=authenticated');

  switch (method) {
    case 'GET':
      try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.status(200).json(categories);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      if (!isAuthenticated) return res.status(401).json({ message: 'Unauthorized' });
      try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'PUT':
      if (!isAuthenticated) return res.status(401).json({ message: 'Unauthorized' });
      try {
        const { id: categoryId } = req.query; // get from query ?id=...
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(updatedCategory);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'DELETE':
      if (!isAuthenticated) return res.status(401).json({ message: 'Unauthorized' });
      const { id } = req.query;
      try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
