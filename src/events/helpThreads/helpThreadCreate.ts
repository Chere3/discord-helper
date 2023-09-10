import { TextChannel, ThreadChannel } from 'discord.js';
import { PyEGPT } from '../../modules/client';

const run = async (client: PyEGPT, channel: ThreadChannel, parentChannel: TextChannel) => {
    await channel.sendTyping();
};

export default run;
