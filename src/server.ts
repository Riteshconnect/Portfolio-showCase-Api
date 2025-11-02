import { httpServer, syncMySQL } from './app'; // 1. Import the server and sync function

const PORT: string | number = process.env.PORT || 5002;

// --- START SERVER & SYNC DB ---
httpServer.listen(PORT, async () => { // 2. Use httpServer
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
  await syncMySQL(); // 3. Call the sync function
});