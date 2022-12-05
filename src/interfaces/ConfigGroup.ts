interface ConfigOneGroup {
    '@all'?: 'all' | 'admin' | null
    '@admin'?: 'all' | 'admin' | null
}
interface ConfigGroup {
  [groupID: string]: ConfigOneGroup
}

export { ConfigGroup, ConfigOneGroup }
