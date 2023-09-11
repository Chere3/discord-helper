import { Colors, TextChannel, ThreadChannel } from 'discord.js';
import { PyEGPT } from '../../modules/client';

const run = async (client: PyEGPT, channel: ThreadChannel, parentChannel: TextChannel) => {
    await channel.sendTyping();

    try {
        const message = await channel.fetchStarterMessage();
        if (!message) return;

        const ai_message = await client.ai.createMessage([
            { role: 'system', content: client.config.ai.systemMessage },
            {
                role: 'user',
                content: `USER TITLE: ${channel.name}\nQUESTION: ${message.content}`,
                name: message.author.globalName ?? message.author.tag,
            },
        ]);

        if (!ai_message || !ai_message.choices[0].message) return;

        const match = ai_message.choices[0].message.content?.match(/(T[ií]tulo:|Title:).*/g);
        const score = match?.[0].match(/\d+/)?.[0];
        const title = match?.[0]?.toString().split('-')[1];

        if ((match || score || title) && parseInt(score ?? '0') <= 5)
            await channel.setName(`${title?.slice(0, 97) ?? ''}...`);

        await message.reply({
            embeds: [
                {
                    color: Colors.Blue,
                    description: `${
                        ai_message?.choices[0].message.content?.replace(match?.toString() ?? '__ds', '') ??
                        'No se ha podido crear el mensaje.'
                    }`,
                },
            ],
        });
    } catch (error) {
        console.error(error);
    }
};

export default run;
