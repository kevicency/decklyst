interface SpriteData<TLists> {
  frameWidth: number
  frameHeight: number
  frameDuration: number
  extraX: number
  extraY: number
  lists: TLists
}

export type UnitSpriteData = SpriteData<UnitLists>
export type IconSpriteData = SpriteData<IconLists>

export interface UnitLists {
  hit: Point[]
  death: Point[]
  breathing: Point[]
  idle: Point[]
  attack: Point[]
  run: Point[]
}

export interface IconLists {
  active: Point[]
  inactive: Point[]
}

export interface Point {
  x: number
  y: number
}
