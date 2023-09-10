import { Interaction } from 'discord.js';
import { PyEGPT } from '../modules/client';
import { CommandContext } from '../modules/command';

const run = async (client: PyEGPT, interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const args = interaction.options.data.map((arg) => arg.value) as string[];
    const context = new CommandContext(client, command, args, interaction);

    if ((await command.checkCommand(interaction)) !== true) return;

    command.execute(context);
};

export default run;
