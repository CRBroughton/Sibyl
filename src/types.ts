export interface DBEntry<T> {
  type: T
  primary?: boolean
  nullable?: boolean
  unique?: boolean
  autoincrement: boolean
}

export type DBValue<T> = T extends DBNumber
  ? DBEntry<T>
  : Omit<DBEntry<T>, 'autoincrement'>

export type DBBoolean = 'bool'
export type DBNumber = 'int' | 'real' | 'INTEGER'
export type DBString = 'varchar' | 'char'
export type DBDate = 'text' | 'int' | 'real'
export type DBBlob = 'blob'

export type MappedTable<T> = {
  [Key in keyof T]:
  T[Key] extends boolean ? DBValue<DBBoolean> :
    T[Key] extends number ? DBValue<DBNumber> :
      T[Key] extends string ? DBValue<DBString> :
        T[Key] extends Date ? DBValue<DBDate> :
          T[Key] extends Blob ? DBValue<DBBlob> :
            null
}
