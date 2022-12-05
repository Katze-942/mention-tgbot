import generateBasicDialogTags from '../../utils/generateBasicDialogTags'

import { Composer, InlineKeyboard } from 'grammy'
import { ReplyMessage } from '../../classes/ReplyMessage'

import buttonNames from '../../contents/commands/start-and-help/buttonAddBot'
import message from '../../contents/commands/start-and-help/message'
export const cmd = new Composer()
cmd
  .command(['start', 'help'])
  .use((ctx) => {
    const dManager = new ReplyMessage(ctx.from?.id, ctx.chat.id, ctx.message?.message_id)
    const tags = generateBasicDialogTags(ctx)

    const inlineButtons = new InlineKeyboard()
    inlineButtons.url(dManager.getTextAccordingLanguage(buttonNames), `https://t.me/${ctx.me.username}?startgroup=user`)

    dManager.send(message, tags, { reply_markup: inlineButtons }).catch(console.error)
  })
