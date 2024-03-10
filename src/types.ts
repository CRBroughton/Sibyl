export interface SelectArgs<T> {
    where: Partial<T>
    offset?: number
    limit?: number
}

export interface DataStructure {
    columns: string[]
    values: any[][]
}