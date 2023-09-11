import {
    Colors,
    CommandInteraction,
    InteractionReplyOptions,
    InteractionResponse,
    Message,
    MessageEditOptions,
    MessagePayload,
    MessageReplyOptions,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import { AskBot } from './client';

interface CommandOptions {
    name: string;
    description?: string;
    slash?: RESTPostAPIChatInputApplicationCommandsJSONBody;
    aliases?: string[];
    category?: string;
    usage?: string;
    cooldown?: number;
    /*
    ownerOnly?: boolean;
    */

    guildOnly?: boolean;
    devOnly?: boolean;
    examples: string[];
}

/**
 * The default command class.
 * @class Command
 * @abstract
 */

export class Command {
    /**
     * The client.
     * @type {AskBot}
     */

    client: AskBot;

    /**
     * The command options.
     * @type {CommandOptions | undefined}
     */

    options: CommandOptions | undefined;

    constructor(client: AskBot, options?: CommandOptions) {
        this.client = client;
        this.options = options;

        // Defaults
        this.options = {
            name: this.options?.name ?? 'unknown',
            description: this.options?.description ?? 'unknown',
            slash: this.options?.slash ?? {
                name: this.options?.name ?? 'unknown',
                description: this.options?.description ?? 'unknown',
            },
            aliases: this.options?.aliases ?? [],
            category: this.options?.category ?? 'unknown',
            usage: this.options?.usage ?? 'unknown',
            cooldown: this.options?.cooldown ?? 0,
            guildOnly: this.options?.guildOnly ?? true,
            /*
             * If you want to use the ownerOnly option, uncomment this.
             ownerOnly: this.options?.ownerOnly ?? false
             */
            devOnly: this.options?.devOnly ?? false,
            examples: this.options?.examples ?? [],
        };
    }

    /**
     * The command name.
     * @type {string}
     * @readonly
     */

    async checkCommand(
        convertibleObject: CommandInteraction | Message
    ): Promise<Message<boolean> | InteractionResponse<boolean> | boolean> {
        const args = this.options?.usage?.match(/<.+?>/g) ?? [];
        const content =
            convertibleObject instanceof Message
                ? convertibleObject.content
                : convertibleObject.options.data.map((x) => x.value).join(' ');

        if (
            this.options?.devOnly &&
            !this.client.config.bot.developers.includes(convertibleObject.member?.user.id ?? '')
        )
            return false;

        if (this.options?.guildOnly && convertibleObject.guild === null) return false;
        /*
         * If you want to use the ownerOnly option, uncomment this.
         if (this.options?.ownerOnly && convertibleObject.author.id !== this.client.config.bot.owner) return false
         */

        if (args.length > 0 && content.split(' ').length - 1 < args.length)
            return await convertibleObject.reply({
                embeds: [
                    {
                        color: Colors.Blue,
                        author: {
                            name: '¡El comando no se ha ejecutado correctamente!',
                        },
                        description: `**No has proporcionado los argumentos necesarios para ejecutar ese comando.**\n**Uso:**\`\`\`${
                            this.options?.usage ?? ''
                        }\`\`\`\n**Ejemplos de uso:**\`\`\`${this.options?.examples.join('\n') ?? ''}\`\`\``,
                    },
                ],
                ephemeral: true,
            });

        return true;
    }

    /**
     * The command executor.
     * @param {CommandContext} context The command context.
     * @returns {void}
     * @abstract
     */
    execute(context: CommandContext) {}
}

export class CommandContext {
    /**
     * The client context.
     * @type {AskBot}
     * @readonly
     */

    readonly client: AskBot;

    /**
     * The command context.
     * @type {Command}
     * @readonly
     */

    readonly command: Command;

    /**
     * The command arguments.
     * @type {string[]}
     * @readonly
     */

    readonly args: string[];

    /**
     * The command data.
     * @type {Message | CommandInteraction}
     * @readonly
     */

    readonly data: Message | CommandInteraction;

    /**
     * The command context.
     * @param client - The client.
     * @param command - The command.
     * @param args - The command arguments.
     * @param data - The command data, can be a message or a command interaction.
     */
    constructor(client: AskBot, command: Command, args: string[], data: Message | CommandInteraction) {
        this.client = client;
        this.command = command;
        this.args = args;
        this.data = data;
    }

    /**
     * The command reply.
     * @param content - The reply content.
     * @returns {Promise<Message>}
     */

    async reply(
        content: string | (MessagePayload | MessageReplyOptions) | (InteractionReplyOptions & { fetchReply?: true })
    ) {
        if (this.data instanceof Message)
            return this.data.reply(content as string | MessagePayload | MessageReplyOptions).catch(console.error);
        else return this.data.reply(content as InteractionReplyOptions | MessagePayload).catch(console.error);
    }

    /**
     * The command edit.
     * @param content - The edit content.
     * @returns {Promise<Message>}
     */

    async edit(content: string | MessagePayload | (MessageEditOptions & { fetchReply?: true })) {
        if (this.data instanceof Message) return this.data.edit(content).catch(console.error);
        else return this.data.editReply(content as InteractionReplyOptions | MessagePayload).catch(console.error);
    }
}
