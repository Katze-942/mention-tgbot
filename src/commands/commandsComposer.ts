import { Composer } from 'grammy'

import { cmd as startCommand } from './Basic/start-and-help'
import { cmd as setAll } from './Basic/set-*-*'

export const commandsComposer = new Composer()
commandsComposer.use(startCommand)
commandsComposer.use(setAll)
