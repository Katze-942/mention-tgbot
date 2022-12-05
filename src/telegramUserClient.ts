import input from './utils/input'
import { StringSession } from 'telegram/sessions'
import { TelegramClient } from 'telegram'
import { appendFileSync } from 'fs'
import { disableSessionWritingInEnv } from './config/basic.json'

async function getClient (): Promise<TelegramClient> {
  console.log('[TELEGRAM-USER] It will now connect to your Telegram account.')
  const apiId = Number(process.env.TELEGRAM_USER_API_ID ?? await input('>>> Please enter your API ID: '))
  const apiHash = process.env.TELEGRAM_USER_API_HASH ?? await input('>>> Please enter your API HASH: ')
  const stringSession = new StringSession(process.env.TELEGRAM_USER_SESSION_CODE ?? '')

  console.log('[TELEGRAM-USER] Loading and connecting to Telegram User API...')
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5
  })
  await client.start({
    phoneNumber: process.env.TELEGRAM_USER_PHONE_NUMBER ?? await input('>>> Please enter your number: '),
    password: async () => process.env.TELEGRAM_USER_PASSWORD ?? await input('>>> Please enter your password: '),
    phoneCode: async () => {
      return await input('>>> Please enter the code you received: ')
    },
    onError: (err) => console.error(err)
  })
  console.log('[TELEGRAM-USER] You should now be connected.')
  if (!process.env.TELEGRAM_USER_SESSION_CODE) {
    if (disableSessionWritingInEnv) console.warn('[TELEGRAM-USER-WARN] The session is not saved because in basic.json you set "true" to "disableSessionWritingInEnv". After rebooting the bot, you will have to re-enter all the data!')
    else {
      console.log('[TELEGRAM-USER] Writing your session data to .env file...')
      appendFileSync('.env', `TELEGRAM_USER_SESSION_CODE=${client.session.save()}`)
      console.log('[TELEGRAM-USER] Session recording completed!')
    }
  } else console.log('[TELEGRAM-USER] The token is already saved in the .env file.')
  return client
}

export default getClient
