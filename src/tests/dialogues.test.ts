import { MultilingualDialogues } from '../interfaces/MultilingualDialogues'

import buttonAddBot from '../contents/commands/start-and-help/buttonAddBot'
import messageStart from '../contents/commands/start-and-help/message'

interface AllDialogues {
  [typeDialogue: string]: Array<[MultilingualDialogues, string]>
}

const allDialogues: AllDialogues = {
  messages: [
    [messageStart, 'commands/start-and-help/message']
  ],
  buttons: [
    [buttonAddBot, 'commands/start-and-help/buttonAddBot']
  ],
  responseFromButtons: []
}

describe('Checking for empty lines', function () {
  for (const typeDialogue in allDialogues) {
    for (const dialogue of allDialogues[typeDialogue]) {
      it(`#src/contents/${dialogue[1]}.dialogue.ts`, function (done) {
        for (const language in dialogue[0]) {
          if (dialogue[0][language as keyof typeof dialogue[0]]?.length === 0) throw Error(`There is an empty string in the "${language}" key!`)
        }
        done()
      })
    }
  }
})

describe('Checking the maximum length of messages', function () {
  for (const dialogue of allDialogues.messages) {
    it(`#src/contents/${dialogue[1]}.dialogue.ts`, function (done) {
      for (const language in dialogue[0]) {
        if (Number(dialogue[0][language as keyof typeof dialogue[0]]?.length) > 4000) throw Error(`The key "${language}" exceeds the length of 4000 characters!`)
      }
      done()
    })
  }
})

describe('Checking the maximum length of buttons name', function () {
  for (const dialogue of allDialogues.buttons) {
    it(`#src/contents/${dialogue[1]}.dialogue.ts`, function (done) {
      for (const language in dialogue[0]) {
        if (Number(dialogue[0][language as keyof typeof dialogue[0]]?.length) > 120) throw Error(`Of course, we understand your love for literature and essays, but it seems to us that for a button with the key "${language}" you do not need to write a name of more than 120 characters.`)
      }
      done()
    })
  }
})

describe('Checking the maximum length of responses when pressing buttons', function () {
  for (const dialogue of allDialogues.responseFromButtons) {
    it(`#src/contents/${dialogue[1]}.dialogue.ts`, function (done) {
      for (const language in dialogue[0]) {
        if (Number(dialogue[0][language as keyof typeof dialogue[0]]?.length) > 60) throw Error(`Do not write too large an answer in the key "${language}". Your answer exceeds 60 characters, we recommend reducing it to 30-40.`)
      }
      done()
    })
  }
})
