import commandsInfo from '../config/commandsInfo'

import { Bot } from 'grammy'
import { commandsComposer } from '../commands/commandsComposer'
import { eventsComposer } from '../events/eventsComposer'

class TelegramClient extends Bot {
  /** Activates the error interceptor, connects the bot to Telegram and uploads commands. */
  public login (): void {
    if (process.env.STOP_BOT_LOGIN) return
    this.catch((err: unknown) => {
      console.error(err)
      console.error('>>> Some kind of error was intercepted.')
    })

    this._loadComposers()
    this.updateCommandInformation().catch((err: unknown) => {
      console.error(err)
      console.error('>>> An error occurred while updating the status of the commands.')
    })

    this.start().then(() => {
      console.log('[TELEGRAM-BOT] Login!')
    }).catch((err: unknown) => {
      console.error(err)
      console.error('>>> Failed to log in! Check the token in the .env file.')
    })
  }

  /** Include all composers, for example, composers responsible for teams and events. */
  private _loadComposers (): void {
    this.use(commandsComposer)
    this.use(eventsComposer)
  }

  /** Updates information about teams in Telegram. */
  public async updateCommandInformation (): Promise<void> {
    console.log('[TELEGRAM-BOT] Updating information about the commands...')

    const commands = Object.keys(commandsInfo)
      // Filtering only by the commands shown.
      .filter(cmdName => commandsInfo[cmdName].show)

      // Filtering by commands that have a description.
      .filter(cmdName => {
        if (commandsInfo[cmdName].shortDescription.length === 0) {
          return console.warn(`[TELEGRAM-BOT-WARN] The /${cmdName} command has an empty short description.`)
        }

        return true
      }).map(cmdName => ({ command: cmdName, description: commandsInfo[cmdName].shortDescription }))

    await this.api.setMyCommands(commands)
    console.log('[TELEGRAM-BOT] Information about the teams has been updated.')
  }
}

export default TelegramClient
