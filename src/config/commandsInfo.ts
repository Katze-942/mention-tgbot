interface infoScheme {
  [commandName: string]: {
    /** Display the command in the tooltips. */
    show: boolean

    /** A brief description of the command that will be shown in the prompts. */
    shortDescription: string
  }
}

const scheme: infoScheme = {
  help: {
    show: true,
    shortDescription: 'Show help.'
  },
  set_all_all: {
    show: false,
    shortDescription: 'Allow all members to be mentioned via @all'
  },
  set_all_admin: {
    show: false,
    shortDescription: 'Only allow admins to be mentioned via @all.'
  },
  set_all_noone: {
    show: false,
    shortDescription: 'Don\'t respond to @all.'
  },
  set_admin_all: {
    show: false,
    shortDescription: 'Allow all members to be mentioned via @admin.'
  },
  set_admin_admin: {
    show: false,
    shortDescription: 'Only allow admins to be mentioned via @admin.'
  },
  set_admin_noone: {
    show: false,
    shortDescription: 'Don\'t respond to @admin.'
  }
}

export default scheme
