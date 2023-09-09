import { inspect } from 'bun';
import { Colors } from 'discord.js';
import { PyEGPT } from '../../modules/client';
import { Command, CommandContext } from '../../modules/command';

export default class EvalCommand extends Command {
    constructor(client: PyEGPT) {
        super(client, {
            name: 'eval',
            description: 'Evalúa un código',
            usage: 'eval <args>',
            devOnly: true,
        });
    }

    async execute(context: CommandContext) {
        const code = context.args.join(' ');
        try {
            const result = eval(code) as unknown;
            await context.data.reply({
                embeds: [{ description: `\`\`\`${inspect(result, { depth: 0 })}\`\`\``, color: Colors.Green }],
                allowedMentions: { repliedUser: false },
            });
        } catch (error) {
            console.error(error);
            await context.data.reply({
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                embeds: [{ description: `\`\`\`${error}\`\`\``, color: Colors.Red }],
                allowedMentions: { repliedUser: false },
            });
        }
    }
}