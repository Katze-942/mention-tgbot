import generateBasicDialogTags from '../utils/generateBasicDialogTags'
import adaptTextToHTML from '../utils/adaptTextToHTML'

import { Context } from 'grammy'
import { config } from 'dotenv'
import assert from 'assert'

process.env.STOP_BOT_LOGIN = 'true'
config()

// eslint-disable-next-line import/first
import { ReplyMessage } from '../classes/ReplyMessage'

describe('Checking #DialogManager.replaceTags', function () {
  it('Hello {TAG}! === Hello world!', function () {
    assert.equal(ReplyMessage.replaceTags('Hello {TAG}!', { TAG: 'world' }), 'Hello world!')
  })
  it('{TAG} {TAG}! === world world!', function () {
    assert.equal(ReplyMessage.replaceTags('{TAG} {TAG}!', { TAG: 'world' }), 'world world!')
  })
  it('{Hello} {TAG}! === {Hello} world!', function () {
    assert.equal(ReplyMessage.replaceTags('{Hello} {TAG}!', { TAG: 'world' }), '{Hello} world!')
  })
  it('{Hi} {TAG}! === Hello world!', function () {
    assert.equal(ReplyMessage.replaceTags('{Hi} {TAG}!', { Hi: 'Hello', TAG: 'world' }), 'Hello world!')
  })
  it('{{} }{ {Ta } {Tag} === {{} }{ {Ta } Hello!', function () {
    assert.equal(ReplyMessage.replaceTags('{{} }{ {Ta } {Tag}', { Ta: 'Error', Tag: 'Hello!' }), '{{} }{ {Ta } Hello!')
  })
})

describe('Checking #utils.adaptTextToHTML', function () {
  it('> Hello! === &gt; Hello!', function () {
    assert.equal(adaptTextToHTML('> Hello!'), '&gt; Hello!')
  })
  it('>> Hello! === &gt;&gt; Hello!', function () {
    assert.equal(adaptTextToHTML('>> Hello!'), '&gt;&gt; Hello!')
  })
  it('>Hello! === &gt;Hello!', function () {
    assert.equal(adaptTextToHTML('>Hello!'), '&gt;Hello!')
  })
  it('<Hello! === &lt;Hello!', function () {
    assert.equal(adaptTextToHTML('<Hello!'), '&lt;Hello!')
  })
  it('< Hello! === &lt; Hello!', function () {
    assert.equal(adaptTextToHTML('< Hello!'), '&lt; Hello!')
  })
  it('Hello & World! === Hello &amp; World!', function () {
    assert.equal(adaptTextToHTML('Hello & World!'), 'Hello &amp; World!')
  })
  it('Hello&World! === Hello&amp;World!', function () {
    assert.equal(adaptTextToHTML('Hello&World!'), 'Hello&amp;World!')
  })
})

describe('Checking #utils.generateBasicDialogTags', function () {
  it('Checking for the presence of basic tags for a user with a FULL name and USERNAME', function (done) {
    const ctx = { from: { username: 'yyy', first_name: '&Haha >', last_name: 'Mouse <' } } as unknown as Context
    const tags = generateBasicDialogTags(ctx)

    if (ctx.from?.username) ctx.from.username = `@${ctx.from?.username}`

    if (tags.usernameOrName !== ctx.from?.username) throw Error(`{usernameOrName} should be "${ctx.from?.username}", but is "${tags.usernameOrName}"`)
    if (tags.usernameOrFullName !== ctx.from.username) throw Error(`{usernameOrFullName} should be "${ctx.from.username}", but is "${tags.usernameOrFullName}"`)
    if (tags.lastName !== '&amp;Haha &gt;') throw Error(`{lastName} should be "&amp;Haha &gt;", but is "${tags.lastName}"`)
    if (tags.fullName !== '&amp;Haha &gt; Mouse &lt;') throw Error(`{fullName} should be "&amp;Haha &gt; Mouse &lt;", but is "${tags.fullName}"`)
    done()
  })

  it('Checking for the presence of basic tags for a user with a FULL name and WITHOUT a USERNAME', function (done) {
    const ctx = { from: { username: undefined, first_name: 'Haha', last_name: 'Mouse' } } as unknown as Context
    const fullName = `${ctx.from?.first_name} ${ctx.from?.last_name}`
    const tags = generateBasicDialogTags(ctx)

    if (tags.usernameOrName !== ctx.from?.first_name) throw Error(`{usernameOrName} should be "${ctx.from?.first_name}", but is "${tags.usernameOrName}"`)
    if (tags.usernameOrFullName !== fullName) throw Error(`{usernameOrFullName} should be "${fullName}", but is "${tags.usernameOrFullName}"`)
    done()
  })

  it('Checking for the presence of basic tags for a user with a NON-FULL name with a USERNAME', function (done) {
    const ctx = { from: { username: 'yyy', first_name: 'Haha', last_name: undefined } } as unknown as Context
    const fullName = `${ctx.from?.first_name}`
    const tags = generateBasicDialogTags(ctx)

    if (ctx.from?.username) ctx.from.username = `@${ctx.from?.username}`

    if (tags.usernameOrName !== ctx.from?.username) throw Error(`{usernameOrName} should be "${ctx.from?.username}", but is "${tags.usernameOrName}"`)
    if (tags.usernameOrFullName !== ctx.from.username) throw Error(`{usernameOrFullName} should be "${ctx.from.username}", but is "${tags.usernameOrFullName}"`)
    if (tags.fullName !== fullName) throw Error(`{fullName} should be "${fullName}", but is "${tags.fullName}"`)
    done()
  })

  it('Checking for the presence of basic tags for a user with an INCOMPLETE name and WITHOUT a USERNAME', function (done) {
    const ctx = { from: { username: undefined, first_name: 'Haha', last_name: undefined } } as unknown as Context
    const fullName = `${ctx.from?.first_name}`
    const tags = generateBasicDialogTags(ctx)

    if (tags.usernameOrName !== ctx.from?.first_name) throw Error(`{usernameOrName} should be "${ctx.from?.first_name}", but is "${tags.usernameOrName}"`)
    if (tags.usernameOrFullName !== fullName) throw Error(`{usernameOrFullName} should be "${fullName}", but is "${tags.usernameOrFullName}"`)
    if (tags.fullName !== fullName) throw Error(`{fullName} should be "${fullName}", but is "${tags.fullName}"`)
    done()
  })

  it('Checking tag extensions', function (done) {
    const ctx = { from: { username: undefined, first_name: 'Haha', last_name: undefined } } as unknown as Context
    const tags = generateBasicDialogTags(ctx, { taaag: 'Hi!' })

    if (tags.taaag !== 'Hi!') throw Error(`The additional tag "taaag" should be equal to "Hi!", but equal to "${tags.taaag}"`)
    done()
  })
})
