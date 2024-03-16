export type SibylResponse<T> = {
  [Key in keyof T]:
  T[Key] extends boolean ? 0 | 1 :
    T[Key]
}

export interface SelectArgs<T> {
  where: Partial<T>
  offset?: number
  limit?: number
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
