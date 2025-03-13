export type RequestsDataType = {
  name: string,
  phone: string,
  service?: string,
  type: DataType
}

export enum DataType {
  order = 'order',
  consultation = 'consultation'
}
