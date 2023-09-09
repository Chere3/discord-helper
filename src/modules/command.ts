import { CommandInteraction, Message } from 'discord.js';
import { PyEGPT } from './client';

interface CommandOptions {
    name: string;
    description?: string;
    aliases?: string[];
    category?: string;
    usage?: string;
    cooldown?: number;
    ownerOnly?: boolean;
    guildOnly?: boolean;
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
}