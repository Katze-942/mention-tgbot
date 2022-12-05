# mention-tgbot
### Russian documentation is [here](./doc/RU/README.md)
Telegram bot that makes it easy to mention all users or administrators.

## Bot commands
- `/start` / `/help` - Information about the commands, a link to add the bot to the chat.
- `/set_all_all` - Allow all users to be mentioned via @all (#all)
- `/set_all_admin` - Allow only chat administrators to be mentioned via @all (#all)
- `/set_all_noone` - Do not respond to @all (#all)
- `/set_admin_all` - Mention all users via @admin (#admin)
- `/set_admin_admin` - Mention only administrators via @admin (#admin)
- `/set_admin_noone` - Do not respond to @admin (#admin)

## Supported languages at the moment:
- 🇬🇧 | English (by default)

## Preparation
1. Install [Node.js LTS](https://nodejs.org/en/).
2. Run the `corepack enable` command. You may need to log in to CMD as an administrator if you are on Windows.
3. Write the `yarn` command in the project folder.
4. Write the command `yarn run initFiles`, the necessary configuration files will be created in the folder with the project.

## Preparing the bot for launch
1. Log in or register your [Telegram account](https://my.telegram.org/).
2. Then click "API development tools" and fill in the details of your application (only the name of the application and a short name are required).
3. Finally, click "Create Application".
4. Insert the API ID and API HASH in the .env file, as well as the application phone number.
5. Don't forget to put your bot's token into `TELEGRAM_BOT_TOKEN`.
6. Finally, the final file should look something like this:
```fix
TELEGRAM_BOT_TOKEN=3829410421:AIO_dhjlskAJKLDJlkd_S9d879S
TELEGRAM_USER_API_ID=49134953
TELEGRAM_USER_API_HASH=d8d098d098dsf7983guoh4940
TELEGRAM_USER_PHONE_NUMBER=+12345679089
```
## Launching the bot
- Enter the command `yarn run start`
- During startup, the bot will ask you to enter your password and code to sign in to your Telegram account. This data will later be written to an .env file, so make sure this file is secure!
---
## Additional documentation:
- [Configuring the main parameters of the bot.](./doc/EN/Configuration.md)
- [A tool for checking your settings and instructions for possible errors (Highly recommended)](./doc/EN/Testing_and_Errors.md)
