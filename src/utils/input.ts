import { createInterface } from 'readline'

/**
 * Asks the user a question in the console.
 * @param question
 */
const input = async (question: string): Promise<string> => await new Promise(resolve => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(question, answer => {
    rl.close()
    resolve(answer)
  })
})

export default input
