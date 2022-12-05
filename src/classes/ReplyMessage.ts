import bot from '../telegramClient'

import { MultilingualDialogues, languages } from '../interfaces/MultilingualDialogues'
import { Other } from 'grammy/out/core/api'
import { RawApi } from 'grammy'

interface Tags {
  [key: string]: string
}

// Information about who has what language.
export const userLanguages: Map<number, languages> = new Map()

/** This class is responsible for processing text files with different languages.
 * There are functions for responding to the user in the language he needs. */
export class ReplyMessage {
  public userId: number | undefined
  public chatId: number
  public messageId: number | undefined

  /**
   * @param userId ID of the user to respond to. The text will be output based on its language.
   * @param chatId Chat ID where the response will be sent.
   * @param messageId ID of the message to be answered.
   */
  constructor (userId: number | undefined, chatId: number, messageId?: number | undefined) {
    this.userId = userId
    this.chatId = chatId
    this.messageId = messageId
  }

  /**
   * Process `{tags}`
   * @param text Source text with `{tags}`
   * @param tags What to replace tags with
   * @returns Processed text without `{tags}`
   */
  static replaceTags (text: string, tags: Tags): string {
    const keys = Object.keys(tags)

    for (const tag of keys) {
      const regex = new RegExp(`{${tag}}`, 'g')
      text = text.replace(regex, tags[tag])
    }

    return text
  }

  /** Get the text according to some language. */
  static getTextAccordingLanguage (content: MultilingualDialogues, language: languages = 'EN'): string {
    return content[language] ?? content.EN
  }

  /** Get the text according to some language. */
  public getTextAccordingLanguage (content: MultilingualDialogues): string {
    if (this.userId === undefined) return content.EN
    return content[userLanguages.get(this.userId) ?? 'EN'] as string
  }

  /**
   * Send a message to the channel by replying to the user's message.
   * Sends a message according to the user's language, preprocessing all {tags} in the file
   * @param content Array of strings.
   * @param tags Tags in messages.
   * @param other Additional parameters for the SendMessage function
   */
  public async send (content: MultilingualDialogues, tags = {}, other: Other<RawApi, 'sendMessage', 'chat_id' | 'text'> = {}): Promise<void> {
    try {
      // If a person has a language that is not fully registered in the bot, English will be used.
      const text = ReplyMessage.replaceTags(this.getTextAccordingLanguage(content), tags)

      // Send a message.
      await bot.api.sendMessage(this.chatId, text, Object.assign({
        parse_mode: 'HTML',
        reply_to_message_id: this.messageId,
        allow_sending_without_reply: true
      }, other))
    } catch (err) {
      console.error(`\n[REPLY_MESSAGE] Some mistake has occurred.
>> User ID: ${this.userId}
>> Chat ID: ${this.chatId}
>> Message ID: ${this.messageId}
>> Additional parameters:
${String(other)}

Error: ${String(err.stack)}`)
    }
  }
}
