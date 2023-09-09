import {
    CommandInteraction,
    InteractionReplyOptions,
    Message,
    MessageEditOptions,
    MessagePayload,
    MessageReplyOptions,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import { PyEGPT } from './client';

interface CommandOptions {
    name: string;
    description?: string;
    slash?: RESTPostAPIChatInputApplicationCommandsJSONBody;
    aliases?: string[];
    category?: string;
    usage?: string;
    cooldown?: number;
    ownerOnly?: boolean;
    guildOnly?: boolean;
    devOnly?: boolean;
}

/**
 * The default command class.
 * @class Command
 * @abstract
 */

export class Command {
    /**
     * The client.
     * @type {PyEGPT}
     */

    client: PyEGPT;

    /**
     * The command options.
     * @type {CommandOptions | undefined}
     */

    options: CommandOptions | undefined;

    constructor(client: PyEGPT, options?: CommandOptions) {
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
            ownerOnly: this.options?.ownerOnly ?? false,
            guildOnly: this.options?.guildOnly ?? true,
            devOnly: this.options?.devOnly ?? false,
        };
    }

    /**
     * The command name.
     * @type {string}
     * @readonly
     */

    checkCommand(convertibleObject: CommandInteraction | Message): boolean {
        const args = this.options?.usage?.match(/<.+?>/g) ?? [];
        console.log(args);

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
     * @type {PyEGPT}
     * @readonly
     */

    readonly client: PyEGPT;

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
    constructor(client: PyEGPT, command: Command, args: string[], data: Message | CommandInteraction) {
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
