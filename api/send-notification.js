const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { tokens, title, body } = req.body;
  if (!tokens?.length) return res.status(400).json({ error: 'No tokens' });
  try {
    const messaging = getMessaging();
    await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
      webpush: {
        notification: { icon: '/icon-192.png', badge: '/icon-192.png', vibrate: [200,100,200] },
        fcmOptions: { link: 'https://app-familia-six.vercel.app' }
      }
    });
    res.status(200).json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
