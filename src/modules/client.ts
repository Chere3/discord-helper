/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Client, Collection, Options, Partials } from 'discord.js';
import { lstat, readdir } from 'fs/promises';
import path, { join } from 'path';
import url from 'url';
import { Command } from './command';

/**
 * The main client class.
 * @class PyEGPT
 * @abstract
 * @extends {Client}
 */

export class PyEGPT extends Client<boolean> {
    #token: string | null;

    constructor() {
        super({
            intents: ['GuildMembers', 'MessageContent'],
            partials: [Partials.Message, Partials.GuildMember],
            makeCache: Options.cacheWithLimits({
                MessageManager: 20,
                GuildMemberManager: 0,
                ReactionManager: 0,
            }),
        });
        this.#token = process.env.PYEGPT_TOKEN || null;
    }

    /**
     * The client commands.
     * @type {Collection<string, any>}
     */

    commands = new Collection<string, any>();

    /**
     * Login to the client
     * @returns {PyEGPT}
     */
    async init() {
        if (!this.#token) throw new Error('Token is not defined');

        console.log('Logging in..');
        await this.login(this.#token);
        await this.handler();

        return this;
    }

    /**
     * Handle the client events and commands.
     * @returns {string[][]}
     */

    async handler(): Promise<string[][]> {
        const commands = await this.handleCommands(),
            events = await this.handleEvents();

        console.log(`Loaded ${commands.length} commands and ${events.length} events`);

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

            if (stat.isDirectory()) return await this.handleCommands(join(dir, file));
            if (!(file.endsWith('.ts') || file.endsWith('.js'))) continue;

            const { default: Class } = (await import(
                join(path.dirname(url.fileURLToPath(import.meta.url)), dir, file)
            )) as { default: typeof Command };

            try {
                const CommandClass = new Class(this);
                this.commands.set(CommandClass.options?.name ?? 'ping', CommandClass);
                commands.push(CommandClass.options?.name ?? 'ping');
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

            if (stat.isDirectory()) return await this.handleEvents(join(dir, file));
            if (!(file.endsWith('.ts') || file.endsWith('.js'))) continue;

            const eventName = file.slice(0, Math.max(0, file.indexOf('.')));

            try {
                events.push(eventName);
                const event = await import(join(path.dirname(url.fileURLToPath(import.meta.url)), dir, file));
                this.on(eventName, event.default.bind(null, this));
            } catch (err) {
                console.error(err);
            }
        }

        return events;
    }
}
