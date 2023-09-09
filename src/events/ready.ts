import { PyEGPT } from '../modules/client';

const run = (client: PyEGPT) => {
    console.log(`Logged in as ${client.user?.username ?? 'Unknown'}`);

    client.user?.setPresence({
        status: 'idle',
        activities: [
            {
                name: 'Tus mensajes en foros.',
                type: 3,
            },
        ],
    });
};

export default run;
