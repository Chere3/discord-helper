import { PyEGPT } from '../../modules/client';
import { Command, CommandContext } from '../../modules/command';

export default class PingCommand extends Command {
    constructor(client: PyEGPT) {
        super(client, {
            name: 'ping',
            description: 'Pong!',
            usage: 'ping',
        });
    }

    async execute(context: CommandContext) {
        await context.reply({ content: 'Pong!' });
    }
}
