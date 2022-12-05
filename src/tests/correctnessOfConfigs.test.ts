import commandsInfo from '../config/commandsInfo'
import getClient from '../telegramUserClient'

import { Bot } from 'grammy'
import { TypeOfTag } from 'typescript'
import { accessSync, readFileSync } from 'fs'
import { config } from 'dotenv'

config()

interface BasicConfig {
  [key: string]: any
}

const BASIC_CONFIG_PATH = 'src/config/basic.json'
describe('Checking .env', function () {
  let envFileExists = false

  it('File availability', function (done) {
    accessSync('.env')
    envFileExists = true
    done()
  })

  it('#TELEGRAM_BOT_TOKEN', function (done) {
    if (!envFileExists) throw Error('The .env file is missing.')

    if (process.env.TELEGRAM_BOT_TOKEN) done()
    else throw Error('The TELEGRAM_BOT_TOKEN parameter required to launch the Telegram bot is missing.')
  })

  it('#TELEGRAM_USER_API_ID', function (done) {
    if (!envFileExists) throw Error('The .env file is missing.')

    if (process.env.TELEGRAM_USER_API_ID) done()
    else throw Error('The parameter TELEGRAM_USER_API_ID is missing, without it the bot will not be able to connect to your Telegram account.')
  })

  it('#TELEGRAM_USER_API_HASH', function (done) {
    if (!envFileExists) throw Error('The .env file is missing.')

    if (process.env.TELEGRAM_USER_API_HASH) done()
    else throw Error('The parameter TELEGRAM_USER_API_HASH is missing, without it the bot will not be able to connect to your Telegram account.')
  })

  it('#TELEGRAM_USER_PHONE_NUMBER', function (done) {
    if (!envFileExists) throw Error('The .env file is missing.')

    if (process.env.TELEGRAM_USER_PHONE_NUMBER) done()
    else throw Error('The parameter TELEGRAM_USER_PHONE_NUMBER is missing, without it the bot will not be able to connect to your Telegram account.')
  })
})

let basicConfig: BasicConfig | null = null
describe(`Type checking in ${BASIC_CONFIG_PATH}`, function () {
  /**
   * Checks the type of the parameter in the config.
   * @param key Parameter
   * @param type Type from typeof.
   * @param allowNull Allow null type.
   */
  function checkType (key: string, type: TypeOfTag[], allowNull?: boolean): void {
    it(`#${key}`, function (done) {
      if (!basicConfig) throw Error(`Could not read ${BASIC_CONFIG_PATH} file.`)
      if (!(key in basicConfig)) throw Error(`The ${key} property is missing.`)

      if (allowNull && basicConfig[key] === null) return done()

      const typeKey = typeof basicConfig[key]
      if (!type.includes(typeKey)) throw TypeError(`Has the type ${typeKey.toLocaleUpperCase()}, but should be ${type.map(t => t.toUpperCase()).join(' or ')}.`)
      done()
    })
  }

  it('File availability', function (done) {
    basicConfig = JSON.parse(readFileSync(BASIC_CONFIG_PATH).toString())
    done()
  })

  checkType('disableRootVerification', ['boolean'])
  checkType('disableSessionWritingInEnv', ['boolean'])
})

describe('Checking src/config/commandsInfo.ts', function () {
  describe('Checking the shortDescription', function () {
    for (const commandName in commandsInfo) {
      const { shortDescription: desc } = commandsInfo[commandName]
      it(`/${commandName}`, function (done) {
        if (desc.length === 0) throw Error(`In the /${commandName} command, the length of the shortDescription cannot be zero.`)
        if (desc.length > 256) throw Error(`In the /${commandName} command, the length of the shortDescription cannot be more than 256 characters.`)
        done()
      })
    }
  })
})

describe('Checking all data in the Telegram API', function () {
  const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN as string)
  it('Connecting the bot', function (done) {
    this.timeout(0)
    this.slow(500)
    bot.start().catch(() => null)

    bot.api.getMe()
      .then(() => done())
      .catch(() => done(Error('Failed to connect to the bot. You may have incorrectly specified the token in the .env file or you do not have an internet connection.')))
  })

  it('Connecting to Telegram User API.',  async function () {
    this.timeout(0)
    this.slow(500)

    return await new Promise(async (resolve, reject) => {
      const client = await getClient()
      client.getMe()
        .then(() => resolve())
        .catch(() => reject(Error('Failed to connect to your Telegram account.')))
    })
  })
})
