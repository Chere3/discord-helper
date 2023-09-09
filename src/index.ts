import { PyEGPT } from './modules/client';

// Creates a new client instance and starts internal processes.
const client = new PyEGPT({ prefix: '!' });
await client.init().catch(console.error);
