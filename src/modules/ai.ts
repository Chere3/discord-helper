import OpenAI from 'openai';
import { Chat } from 'openai/resources/index.mjs';

/**
 * Artificial Intelligence Modules for the answering system.
 * @abstract
 */

export class AI {
    /**
     * The model to use for the AI.
     * @type {string}
     */

    model: 'gpt' | 'llama';

    /**
     * The openAi configuration.
     * @type {Chat.Completions.ChatCompletionCreateParamsNonStreaming}
     */

    config: Partial<Chat.Completions.ChatCompletionCreateParamsNonStreaming>;

    /**
     * The openAi instance.
     * @type {OpenAI}
     * @private
     */

    #openai: OpenAI;

    /**
     * The AI constructor.
     * @constructor
     * @abstract
     * @returns {void}
     */
    constructor(configuration?: Partial<Chat.Completions.ChatCompletionCreateParamsNonStreaming>) {
        this.model = 'gpt';
        this.#openai = this.#construct(this.model);

        // default config
        this.config = {
            ...configuration,
            model: 'gpt-3.5-turbo',
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        };
    }

    /**
     * Constructs the models for the AI based on the model.
     * @param {string} model The model to use.
     * @returns {void}
     * @private
     */

    #construct(model: string) {
        if (model !== 'gpt') throw new Error('In implementation');

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        return openai;
    }

    /**
     * Creates a new AI completion.
     * @param {} conversation The conversation to use.
     * @returns {Promise<Chat.Completions.ChatCompletionCreateResponse>}
     */

    async createMessage(conversation: Chat.Completions.ChatCompletionMessageParam[]) {
        try {
            const completion = await this.#openai.chat.completions.create({
                ...this.config,
                messages: conversation,
                model: 'gpt-3.5-turbo',
            });

            return completion;
        } catch (error) {
            console.error(error);
        }
    }
}
