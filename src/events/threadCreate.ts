import { ChannelType, ThreadChannel } from 'discord.js';
import { PyEGPT } from '../modules/client';

const run = async (client: PyEGPT, channel: ThreadChannel) => {
    const parentChannel = channel.parent;
    if (parentChannel!.type !== ChannelType.GuildForum) return;
    if (!client.config.bot.forumCategories.includes((await parentChannel?.parent?.fetch())?.name ?? '')) return;

    client.emit('helpThreadCreate', channel, parentChannel);
};

export default run;
