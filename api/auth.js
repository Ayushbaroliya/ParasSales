const { serialize } = require('cookie');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action, password } = req.body;

  if (action === 'login') {
    if (password === process.env.ADMIN_PASSWORD) {
      const cookie = serialize('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
  }

  if (action === 'logout') {
    const cookie = serialize('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true, message: 'Logged out' });
  }

  // Check auth status (if needed as a GET, but we'll use this for POST/check too or just another endpoint)
  if (action === 'check') {
      const cookies = req.headers.cookie;
      const isAuthenticated = cookies && cookies.includes('admin_session=authenticated');
      return res.status(200).json({ authenticated: !!isAuthenticated });
  }

  return res.status(400).json({ message: 'Invalid action' });
};
