import { Colors } from 'discord.js';
import { PyEGPT } from '../../modules/client';
import { Command, CommandContext } from '../../modules/command';

export default class PingCommand extends Command {
    constructor(client: PyEGPT) {
        super(client, {
            name: 'ping',
            description: 'Pong!',
            usage: 'ping',
            examples: ['ping'],
        });
    }

    async execute(context: CommandContext) {
        const time = Date.now();
        const message = context.data.createdTimestamp;

        await context.data.reply({
            embeds: [
                {
                    description: `🏓 **Tiempo de respuesta: \`${message - time}ms\`**\n**🛜 Gateway: \`${
                        context.client.ws.ping
                    }ms\`**`,
                    color: Colors.Blue,
                },
            ],
            allowedMentions: { repliedUser: false },
        });
    }
}
