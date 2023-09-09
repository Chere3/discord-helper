import { PyEGPT } from '../modules/client';

const run = (client: PyEGPT) => {
    console.log(`Logged in as ${client.user?.username ?? 'Unknown'}`);
};

export default run;
