export type SibylResponse<T> = {
  [Key in keyof T]:
  T[Key] extends boolean ? 0 | 1 :
    T[Key]
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
