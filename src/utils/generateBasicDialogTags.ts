import { Context } from 'grammy'
import adaptTextToHTML from './adaptTextToHTML'

interface Tags {
  [key: string]: string
}

/**
 * Generate `{tags}` for the message.
 * @param ctx Context of the message.
 * @param tags Additional `{tags}`
 */
function generateBasicDialogTags (ctx: Context, tags: Tags = {}): Tags {
  if (!ctx.from) return tags

  const fullName = `${ctx.from.first_name} ${ctx.from.last_name ?? ''}`.trim()
  const username = ctx.from.username ? `@${ctx.from.username}` : null

  const object: Tags = Object.assign({
    usernameOrName: username ?? ctx.from.first_name,
    usernameOrFullName: username ?? fullName,
    lastName: ctx.from.first_name,
    fullName
  }, tags)

  for (const key in object) {
    object[key] = adaptTextToHTML(object[key])
  }

  return object
}

export default generateBasicDialogTags
