import { REST, Routes } from 'discord.js';
import { PyEGPT } from '../modules/client';

const run = async (client: PyEGPT) => {
    console.log(`Logged in as ${client.user?.username ?? 'Unknown'}`);

    // set the client user's presence
    client.user?.setPresence({
        status: 'idle',
        activities: [
            {
                name: 'Tus mensajes en foros.',
                type: 3,
            },
        ],
    });

    // Set the client user's application commands
    const rest = new REST({ version: '10' }).setToken(client.token!);
    const commands = client.commands.map((command) => command.options?.slash);

    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(client.user?.id ?? '', client.guilds.cache.first()?.id ?? ''), {
        body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
};

export default run;
