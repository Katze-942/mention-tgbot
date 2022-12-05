import TelegramClient from './classes/TelegramClient'
const bot = new TelegramClient(process.env.TELEGRAM_BOT_TOKEN as string)

bot.login()
export default bot
