import configGroup from '../../exportConfigGroup'
import isAdmin from '../../utils/isAdmin'

import { Composer } from 'grammy'
import { ConfigOneGroup } from '../../interfaces/ConfigGroup'
import { writeFileSync } from 'fs'

export const cmd = new Composer()

/**
 * The function that creates the command.
 * Performs many actions like checking for administrator rights, config and writing a file.
 * @param commandName Command name.
 * @param sentText The text that will be sent if the callback is executed.
 * @param callback The function to be executed.
 */
function addCommand (commandName: string, sentText: string, callback: (conf: ConfigOneGroup) => void): void {
  cmd
    .command(commandName)
    .chatType(['group', 'supergroup'])
    .use(async (ctx) => {
      // Check if the user is an admin.
      const allAdmins = await ctx.getChatAdministrators()
      if (!isAdmin(allAdmins, ctx.from.id)) return await ctx.reply('Sorry, only group admins can run this command.').catch(console.error)

      // Checking the config.
      if (!configGroup[ctx.chat.id]) configGroup[ctx.chat.id] = {}

      callback(configGroup[ctx.chat.id])
      writeFileSync('./data/configGroup.json', JSON.stringify(configGroup, null, 2))
      ctx.reply(sentText).catch(console.error)
    })
}

addCommand('set_all_all', 'Ok, now everyone can use the @all command.', (conf) => {
  conf['@all'] = 'all'
})

addCommand('set_all_admin', 'Ok, now the @all command can only be used by admins.', (conf) => {
  conf['@all'] = 'admin'
})

addCommand('set_all_noone', 'Ok, now the @all command is disabled.', (conf) => {
  conf['@all'] = null
})

addCommand('set_admin_all', 'Ok, now everyone can use the @admin command.', (conf) => {
  conf['@admin'] = 'all'
})

addCommand('set_admin_admin', 'Ok, now the @admin command can only be used by admins.', (conf) => {
  conf['@admin'] = 'admin'
})

addCommand('set_admin_noone', 'Ok, now the @admin command is disabled.', (conf) => {
  conf['@admin'] = null
})
