import { PyEGPT } from './modules/client';

// Creates a new client instance and starts internal processes.
const client = new PyEGPT({ prefix: 'g!', developers: ['852588734104469535'] });
await client.init().catch(console.error);
