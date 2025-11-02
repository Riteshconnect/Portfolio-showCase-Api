import { httpServer, syncMySQL } from './app';

// Render provides PORT as a string. We MUST parse it to a number.
const PORT: number = parseInt(process.env.PORT || '5002', 10);
const HOST = '0.0.0.0';

// --- START SERVER & SYNC DB ---
httpServer.listen(PORT, HOST, async () => {
  console.log(`[server]: Server is running on http://${HOST}:${PORT}`);
  await syncMySQL();
});