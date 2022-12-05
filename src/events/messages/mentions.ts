import adaptTextToHTML from '../../utils/adaptTextToHTML'
import configGroup from '../../exportConfigGroup'
import findFirstMatch from '../../utils/findFirstMatch'
import getClient from '../../telegramUserClient'

import { Api } from 'telegram'
import { Composer } from 'grammy'
import { ConfigOneGroup } from '../../interfaces/ConfigGroup'

type mentionVariations = '@admin' | '#admin' | '@all' | '#all'
interface MentionedUser {
  first_name: string
  id: number
}

/**
 * Text generation with mentions of people.
 * Automatically adapts to different numbers of people.
 * @param mention What kind of mention? @all (#all) or @admin (#admin)?
 * @param userText The text to be attached in addition to the mention.
 * @param members People to be mentioned.
 * @example ```ts
 * // @all Hello!
 * // Жора, Артур
 * generateTextWithMentions('@all', '@all Hello!', [{ id: 12345, first_name: 'Жора' }, { id: 54321, first_name: 'Артур' }])
 */
function generateTextWithMentions (mention: mentionVariations, userText: string, members: MentionedUser[]): string {
  let text: string

  // Calculate how many maximum number of characters will come out with the first display method.
  const characters = 1 + userText.length + members.map(m => m.first_name).join(', ').length

  // If the message comes out too long, then we use the second method, which is shorter.
  if (characters > 4000) {
    // ${mention}
    // 1, 2, 3, 4, 5
    text = `${mention}\n${members.map((m, i) =>
      `<a href="tg://user?id=${m.id}">${i}</a>`).join(members.length <= 830 ? ', ' : ' ')}`
  } else text = `${adaptTextToHTML(userText)}\n${members.slice(0, 2).map(m => `<a href="tg://user?id=${m.id}">${adaptTextToHTML(m.first_name)}</a>`).join(', ')}`
  return text
}

export const mentions = new Composer()
mentions
  .chatType(['group', 'supergroup'])
  .on('message:text', async (ctx) => {
    // This chat configuration.
    const conf: ConfigOneGroup = configGroup[ctx.chat.id]
    if (!conf) return

    // Message text and checking for @all and @admin.
    const textSplit = (ctx.message.text ?? ctx.message.caption).split(' ')
    const allMentionIs = textSplit.includes('@all') || textSplit.includes('#all')
    const adminMentionIs = textSplit.includes('@admin') || textSplit.includes('#admin')

    // @admin
    if ((conf['@all'] === 'admin' && allMentionIs) || (conf['@admin'] === 'admin' && adminMentionIs)) {
      const allAdmins = await ctx.getChatAdministrators()
      const sentText = generateTextWithMentions(
        findFirstMatch(textSplit, ['@admin', '#admin', '@all', '#all']) as mentionVariations,
        textSplit.join(' '),
        allAdmins.filter(adm => !adm.user.is_bot).map((adm) => ({ first_name: adm.user.first_name, id: adm.user.id }))
      )
      ctx.reply(sentText, { parse_mode: 'HTML' }).catch(console.error)
    } else if ((conf['@all'] === 'all' && allMentionIs) || (conf['@admin'] === 'all' && adminMentionIs)) {
      const client = await getClient() // Telegram User Client
      const chatMemberCount = await ctx.getChatMemberCount()
      const chatHash = (await client.invoke(
        new Api.channels.GetFullChannel({
          channel: ctx.chat.id
        })
      // @ts-expect-error
      )).chats[0].accessHash

      let allMembers: MentionedUser[] = []
      // Each iteration in the loop will receive 200 participants in the chat.
      for (let i = 0; i < Math.ceil(chatMemberCount / 200); i++) {
        if (allMembers.length >= 1000) break
        const members = await client.invoke(
          new Api.channels.GetParticipants({
            channel: ctx.chat.id,
            filter: new Api.ChannelParticipantsRecent(),
            hash: chatHash,
            // We do not exceed the limit of a thousand participants.
            limit: allMembers.length >= 800 ? 1000 - allMembers.length : 200,
            // We continue to receive participants from the place where we left off.
            offset: Math.ceil(chatMemberCount / 200) * i
          })
        )
        // @ts-expect-error
        allMembers = allMembers.concat(members.users.filter(m => !m.bot).map(m => ({ first_name: m.firstName, id: m.id })))
      }
      const sentText = generateTextWithMentions(
        findFirstMatch(textSplit, ['@all', '#all', '@admin', '#admin']) as mentionVariations,
        textSplit.join(' '),
        allMembers
      )
      ctx.reply(sentText, { parse_mode: 'HTML' }).catch(console.error)
    }
  })
