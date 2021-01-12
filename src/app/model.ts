export interface BuildingModel {
  name: string
  children: Children[]
}

export interface Children {
  floorName: string
  children: Children2[]
}

export interface Children2 {
  roomName: string
}
