import { Client, ClientOptions, Collection, GatewayIntentBits, Options, Partials } from 'discord.js';
import { lstat, readdir } from 'fs/promises';
import path, { join } from 'path';
import url from 'url';
import config from '../config';
import { AI } from './ai';
import { Command } from './command';

/**
 * The main client class.
 * @class AskBot
 * @abstract
 * @extends {Client}
 */

export class AskBot extends Client<boolean> {
    /**
     * The client token.
     * @type {string | null}
     * @private
     */
    #token: string | null;

    /**
     * The client configuration.
     * @type {typeof config}
     * @private
     */
    config: typeof config;

    constructor(configuration?: Partial<ClientOptions & (typeof config)['bot']>) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            partials: [Partials.Message, Partials.GuildMember],
            allowedMentions: { parse: ['users'], repliedUser: true },
            makeCache: Options.cacheWithLimits({
                MessageManager: 20,
                GuildMemberManager: 0,
                ReactionManager: 0,
                GuildBanManager: 0,
                GuildInviteManager: 0,
                PresenceManager: 0,
                VoiceStateManager: 0,
                StageInstanceManager: 0,
                ThreadManager: 10,
                ThreadMemberManager: 0,
                UserManager: 0,
            }),
            // shards: 'auto', Only if the bot is in more of 1 server.
            ...configuration,
        });
        this.#token = process.env.AskBot_TOKEN || null;
        this.config = { ...config, bot: { ...config.bot, prefix: configuration?.prefix ?? config.bot.prefix } };
    }

    /**
     * The client message prefix.
     * @type {string}
     */

    prefix = config.bot.prefix;

    /**
     * The client commands.
     * @type {Collection<string, Command>}
     */

    commands = new Collection<string, Command>();

    /**
     * The AI module.
     * @type {AI}
     */

    ai = new AI();

    /**
     * Login to the client
     * @returns {AskBot}
     */
    async init() {
        if (!this.#token) throw new Error('Token is not defined');

        console.log('Logging in..');
        await this.handler();
        await this.login(this.#token);

        return this;
    }

    /**
     * Handle the client events and commands.
     * @returns {string[][]}
     */

    async handler(): Promise<string[][]> {
        const commands = await this.handleCommands(),
            events = await this.handleEvents();

        return [commands, events];
    }

    /**
     * Handle the client commands.
     * @returns {string[] | []}
     */

    async handleCommands(dir = '../commands'): Promise<string[] | []> {
        const commands: string[] = [],
            files = await readdir(join(path.dirname(url.fileURLToPath(import.meta.url)), dir));

        for (const file of files) {
            const stat = await lstat(join(path.dirname(url.fileURLToPath(import.meta.url)), dir, file));

            if (stat.isDirectory()) await this.handleCommands(join(dir, file));
            if (!(file.endsWith('.ts') || file.endsWith('.js'))) continue;

            const { default: Class } = (await import(
                join(path.dirname(url.fileURLToPath(import.meta.url)), dir, file)
            )) as { default: typeof Command };

            try {
                const CommandClass = new Class(this);
                this.commands.set(CommandClass.options?.name ?? 'ping', CommandClass);
                commands.push(CommandClass.options?.name ?? 'ping');

                console.log(`Command: ${CommandClass.options?.name ?? 'ping'} loaded`);
            } catch (err) {
                console.error(err);
            }
        }
        return commands;
    }

    /**
     * Handle the client events.
     * @returns {string[] | []}
     */
    async handleEvents(dir = '../events'): Promise<string[] | []> {
        const events: string[] = [],
            files = await readdir(join(path.dirname(url.fileURLToPath(import.meta.url)), dir));

        for (const file of files) {
            const stat = await lstat(join(path.dirname(url.fileURLToPath(import.meta.url)), dir, file));

            if (stat.isDirectory()) await this.handleEvents(join(dir, file));
            if (!(file.endsWith('.ts') || file.endsWith('.js'))) continue;

            const eventName = file.slice(0, Math.max(0, file.indexOf('.')));

            try {
                events.push(eventName);
                const event = (await import(join(path.dirname(url.fileURLToPath(import.meta.url)), dir, file))) as {
                    default: (client: AskBot, ...args: any[]) => Promise<any>;
                };

                this.on(eventName, event.default.bind(this, this));
                console.log(`Event: ${eventName} loaded`);
            } catch (err) {
                console.error(err);
            }
        }

        return events;
    }
}
