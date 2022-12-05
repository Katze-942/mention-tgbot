import { access, appendFileSync, copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { config } from 'dotenv'

console.log('[LOG] Launch!')
access('.env', (err) => {
  if (err) {
    console.log('[.env] File .env does not exist. Creating.')
    copyFileSync('examples/.env.example', '.env')
    console.log('[.env] The file has been created! Configure it.')
  } else {
    console.log('[.env] File .env has already been created. Checking it out.')
    const { parsed } = config()
    const { parsed: parsedExample } = config({ path: 'examples/.env.example' })

    if (!parsed) return console.error('[.env] Dotenv could not find the .env file.')
    if (!parsedExample) return console.error('[.env] There\'s been some mistake! The .env.example file was not found.')
    const newParametrs = Object.keys(parsedExample)
      .filter(key => !(key in parsed))
      .map(k => `${k}=${parsedExample[k]}`)
      .join('\n')
    if (!newParametrs) return console.log('[.env] You don\'t need to write anything new.')
    console.log('[.env] New lines will be written to the .env file:')
    console.log('-'.repeat(20))
    console.log(newParametrs)
    console.log('-'.repeat(20))
    console.log('[.env] Write...')
    appendFileSync('.env', '\n' + newParametrs)
    console.log('[.env] File writing is complete!')
  }
})

access('src/config/basic.json', (err) => {
  if (err) {
    console.log('[basic.json] File basic.json does not exist. Creating.')
    copyFileSync('examples/basic.example.json', 'src/config/basic.json')
    console.log('[basic.json] The file has been created! Configure it.')
  } else {
    console.log('[basic.json] File basic.json has already been created. Checking it out.')
    try {
      const configExample = require('../examples/basic.example.json')
      const config = require('./config/basic.json')

      let overwritingFile = false
      for (const key in configExample) {
        if (!(key in config)) {
          overwritingFile = true
          config[key] = configExample[key]
        }
      }

      if (overwritingFile) {
        console.log('[basic.json] Overwriting the file...')
        writeFileSync('./src/config/basic.json', JSON.stringify(config, null, 2))
        console.log('[basic.json] Recording is complete!')
      } else console.log('[basic.json] Overwriting the file is not required.')
    } catch (err) {
      console.error('[basic.json] Some error occurred while reading basic.json. Maybe the file is broken.')
      console.error(err.stack)
    }
  }
})

access('data/configGroup.json', (err) => {
  if (err) {
    console.log('[configGroup.json] File configGroup.json does not exist. Creating.')
    if (!existsSync('./data')) mkdirSync('data')
    writeFileSync('data/configGroup.json', '{}')
    console.log('[configGroup.json] The file has been created! Done.')
  } else {
    console.log('[configGroup.json] File configGroup.json has already been created. Nothing else needs to be done.')
  }
})
