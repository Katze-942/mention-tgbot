import { ChatMemberAdministrator, ChatMemberOwner } from 'grammy/out/types.node'

/**
 * Is the user an administrator of the chat.
 * @param allAdminsMembers Array of all participants who are the administrator in the chat.
 * @param userId Id of the user to check.
 * @example ```ts
 * // We get a list of all the administrators in the chat.
 * const allAdmins = await ctx.getChatAdministrators()
 *
 * if (isAdmin(allAdmins, '173849')) {
 *   console.log('A user with ID 173849 is an admin!')
 * }
 * ```
 * @returns { boolean }
 */
const isAdmin = (allAdminsMembers: Array<ChatMemberOwner | ChatMemberAdministrator>, userId: string | number): boolean =>
  Boolean(allAdminsMembers.find(c => c.user.id === userId))

export default isAdmin
