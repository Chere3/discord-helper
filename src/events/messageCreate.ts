import { Colors, Message } from 'discord.js';
import { PyEGPT } from '../modules/client';
import { CommandContext } from '../modules/command';

const message = async (client: PyEGPT, message: Message) => {
    if (message.author.bot) return;

    const command = client.commands.get(message.content.split(' ')[0].split(client.prefix)[1]);
    if (!command) return;

    const args = message.content.split(' ').slice(1);
    const context = new CommandContext(client, command, args, message);

    if ((await command.checkCommand(message)) !== true) return;

    try {
        command.execute(context);
    } catch (error: any) {
        console.error(error);
        await message.reply({
            embeds: [
                {
                    author: { name: `Ha ocurrido un error tratando de ejecutar el comando.` },
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                    description: `\`\`\`${error.message}\`\`\``,
                    color: Colors.Red,
                },
            ],
            allowedMentions: { repliedUser: false },
        });
    }
    return;
};

export default message;
