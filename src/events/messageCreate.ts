import { Message } from 'discord.js';
import { PyEGPT } from '../modules/client';
import { CommandContext } from '../modules/command';

const message = (client: PyEGPT, message: Message) => {
    if (message.author.bot) return;

    const command = client.commands.get(message.content.split(' ')[0].split(client.prefix)[1]);
    if (!command) return;

    const args = message.content.split(' ').slice(1);
    const context = new CommandContext(client, command, args, message);

    command.execute(context);
    return;
};

export default message;
