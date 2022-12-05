import { Composer } from 'grammy'

import { mentions } from './messages/mentions'
export const eventsComposer = new Composer()
eventsComposer.use(mentions)