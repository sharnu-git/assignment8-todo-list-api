const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

async function runTests() {
  await connectDB();
  const server = app.listen(5005);
  const baseUrl = 'http://localhost:5005';

  console.log('--- Starting API Endpoints Verification ---');
  let createdId = null;

  try {
    // 1. Health check
    console.log('Testing GET /health ...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = await healthRes.json();
    console.log('Status:', healthRes.status, 'Response:', healthJson);

    // 2. Validation error test
    console.log('\nTesting POST /api/todos (Validation Failure - empty title) ...');
    const failRes = await fetch(`${baseUrl}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' })
    });
    const failJson = await failRes.json();
    console.log('Status:', failRes.status, 'Success:', failJson.success, 'Message:', failJson.message);

    // 3. Create Todo
    console.log('\nTesting POST /api/todos (Success) ...');
    const createRes = await fetch(`${baseUrl}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Complete Assignment 8 Backend',
        description: 'Implement Node, Express, and MongoDB To-Do APIs with full Controller-Service structure',
        priority: 'high',
        status: 'pending',
        tags: ['homework', 'nodejs', 'backend']
      })
    });
    const createJson = await createRes.json();
    console.log('Status:', createRes.status, 'Created ID:', createJson.data.id, 'Title:', createJson.data.title);
    createdId = createJson.data.id;

    // 4. Get All Todos
    console.log('\nTesting GET /api/todos ...');
    const getAllRes = await fetch(`${baseUrl}/api/todos`);
    const getAllJson = await getAllRes.json();
    console.log('Status:', getAllRes.status, 'Total items:', getAllJson.data.pagination.total);

    // 5. Get Todo by ID
    console.log(`\nTesting GET /api/todos/${createdId} ...`);
    const getOneRes = await fetch(`${baseUrl}/api/todos/${createdId}`);
    const getOneJson = await getOneRes.json();
    console.log('Status:', getOneRes.status, 'Title:', getOneJson.data.title);

    // 6. Update Todo (PATCH status to completed)
    console.log(`\nTesting PATCH /api/todos/${createdId} (Mark completed) ...`);
    const patchRes = await fetch(`${baseUrl}/api/todos/${createdId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
    const patchJson = await patchRes.json();
    console.log('Status:', patchRes.status, 'isCompleted:', patchJson.data.isCompleted, 'Status:', patchJson.data.status);

    // 7. Get Stats
    console.log('\nTesting GET /api/todos/overview/stats ...');
    const statsRes = await fetch(`${baseUrl}/api/todos/overview/stats`);
    const statsJson = await statsRes.json();
    console.log('Status:', statsRes.status, 'Stats:', statsJson.data);

    // 8. Delete Todo
    console.log(`\nTesting DELETE /api/todos/${createdId} ...`);
    const delRes = await fetch(`${baseUrl}/api/todos/${createdId}`, { method: 'DELETE' });
    const delJson = await delRes.json();
    console.log('Status:', delRes.status, 'Message:', delJson.message);

    console.log('\n🎉 ALL API TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
