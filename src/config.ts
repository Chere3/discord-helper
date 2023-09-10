/**
 * Default config for the bot
 * @type {Config}
 */
const defaultConfig = {
    bot: {
        prefix: '!',
        developers: [] as string[],
        /*
        * If you want to use the ownerOnly option, uncomment this.
        owners: [] as string[],
        */
        forumCategories: ['test'] as string[],
    },
};

export default defaultConfig;
