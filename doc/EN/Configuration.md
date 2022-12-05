# basic.json setup guide
To get started, open the [basic.json](../../src/config/basic.json) file located in the [src/config/](../../src/config/) directory.
If this file does not exist, type the command `yarn run initFiles`.

## Properties Help
- `disableRootVerification` - A property that disables the check to launch a bot not from the root directory. It is recommended not to touch these properties.
- `disableSessionWritingInEnv` - By default, the client writes your session data to an .env file, so that next time it won't ask you for your password and code. When set to `true`, the bot will ask you for a code to log in to your account at every reboot.

# Configuring the display of commands
Go to the file [src/config/commandsInfo.ts](../../src/config/commandsInfo.ts). Just below you will see a diagram of the commands:
```ts
help: {
  show: true,
    shortDescription: 'Show help.'
},
set_all_all: {
  show: false,
    shortDescription: 'Allow all members to be mentioned via @all.'
}
```
- `help`, `set_all_all` - the names of the commands.
- The `show` parameter is responsible for displaying the command in the Telegram. If the value is `false`, the command will not be offered to the user.
- The `shortDescription` parameter is responsible for a brief description of the command that the user sees when calling it. **Please don't leave this line blank!!**

![Displaying a brief description about the team](../screenshots/telegram_commands.png "Displaying a brief description about the team")

> Back to [README.md](../../README.md)