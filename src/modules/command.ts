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
}
