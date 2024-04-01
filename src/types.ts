export type SibylResponse<T> = {
  [Key in keyof T]:
  T[Key] extends boolean ? 0 | 1 :
    T[Key]
}

interface DBPrimary {
  primary?: boolean
  nullable?: true
  unique?: boolean
  autoincrement: boolean
}

export type DBEntry<T> = {
  type: T
} & (
  T extends DBString
    ? T extends 'varchar'
      ? DBPrimary & { size: number }
      : DBPrimary
    : DBPrimary
)

export type DBValue<T> = T extends DBNumber
  ? DBEntry<T>
  : Omit<DBEntry<T>, 'autoincrement'>

export type DBBoolean = 'bool'
export type DBNumber = 'int' | 'real' | 'INTEGER'
export type DBString = 'varchar' | 'char'
export type DBDate = 'text' | 'int' | 'real'
export type DBBlob = 'blob'
export type DBTypes = DBBoolean | DBNumber | DBString | DBDate

export type MappedTable<T> = {
  [Key in keyof T]:
  T[Key] extends boolean ? DBValue<DBBoolean> :
    T[Key] extends number ? DBValue<DBNumber> :
      T[Key] extends string ? DBValue<DBString> :
        T[Key] extends Date ? DBValue<DBDate> :
          T[Key] extends Blob ? DBValue<DBBlob> :
            null
}

interface OR<T> {
  OR?: T[]
}

export type Sort<T> = {
  [Key in keyof T]:
  T[Key] extends T[Key] ? 'ASC' | 'DESC' : T[Key]
}

export interface SelectArgs<T> {
  where: Partial<T> & OR<Partial<T>>
  offset?: number
  limit?: number
  sort?: Sort<Partial<T>>
}

export interface UpdateArgs<T, K extends string | number | symbol = 'id'> {
  where: Partial<T>
  updates: Partial<Omit<T, | K>>
}

export interface DeleteArgs<T> {
  where: Partial<T>
}

export interface DataStructure {
  columns: string[]
  values: any[][]
}
