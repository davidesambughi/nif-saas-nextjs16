require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function checkPolicies() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT schemaname, tablename, policyname, roles, cmd, qual 
      FROM pg_policies 
      WHERE schemaname = 'public'
      AND tablename IN ('users', 'orders', 'order_documents', 'status_updates');
    `);
    
    console.log('--- POLICY ATTIVE ---');
    console.table(res.rows);

    const rlsRes = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'orders', 'order_documents', 'status_updates');
    `);
    
    console.log('--- STATO RLS ---');
    console.table(rlsRes.rows);

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

checkPolicies();
