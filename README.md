# Askbot - Your Discord Question and Answer Bot

Askbot is a versatile Discord bot designed to facilitate question and answer interactions in forums. It can provide answers using GPT or other models, correct poorly formatted titles, generate question titles, handle mixed messages and slash commands, and integrate with GPT 3.5.

## Prerequisites

Before getting started, make sure you have the following:

-   [Bun 1.0.0](https://github.com/bun/bun)
-   A Discord bot token
-   An OpenAI API key

## Installation

Clone the repository using the following command:

```bash
git clone git@github.com:chere3/askbot.git
```

## Usage

Follow these steps to set up and run the bot:

1. Install dependencies:

```bash
bun install
```

2. Create a `.env` file in the root directory of the project and add the following:

```env
DISCORD_TOKEN=<your_discord_bot_token>
OPENAI_API_KEY=<your_openai_api_key>
```

3. Start the bot:

```bash
bun run
```

## Features

-   Answer questions in forums
-   Correct poorly formatted titles in forums
-   Generate titles for questions
-   Handle mixed messages and slash commands
-   Seamless integration with GPT 3.5

## Contributing

We welcome contributions from the community. If you have any ideas or improvements, please open an issue to discuss them before submitting a pull request.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/). Feel free to use and modify it according to your needs.

Happy questioning and answering with Askbot! 🤖💬
