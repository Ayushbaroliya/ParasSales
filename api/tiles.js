const connectDB = require('./lib/db');
const Tile = require('./models/Tile');

module.exports = async (req, res) => {
  await connectDB();

  const { method } = req;
  const cookies = req.headers.cookie;
  const isAuthenticated = cookies && cookies.includes('admin_session=authenticated');

  switch (method) {
    case 'GET':
      try {
        const tiles = await Tile.find({}).sort({ createdAt: -1 });
        res.status(200).json(tiles);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      if (!isAuthenticated) return res.status(401).json({ message: 'Unauthorized' });
      try {
        const tile = await Tile.create(req.body);
        res.status(201).json(tile);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'PATCH':
      if (!isAuthenticated) return res.status(401).json({ message: 'Unauthorized' });
      const { id } = req.query;
      try {
        const updatedTile = await Tile.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTile) return res.status(404).json({ message: 'Tile not found' });
        res.status(200).json(updatedTile);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'DELETE':
      if (!isAuthenticated) return res.status(401).json({ message: 'Unauthorized' });
      const { id: deleteId } = req.query;
      try {
        const deletedTile = await Tile.findByIdAndDelete(deleteId);
        if (!deletedTile) return res.status(404).json({ message: 'Tile not found' });
        res.status(200).json({ message: 'Tile deleted' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
