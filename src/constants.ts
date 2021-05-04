export const front = 'front' as const
export type Front = typeof front

export const top = 'top' as const
export type Top = typeof top

export const right = 'right' as const
export type Right = typeof right

export const bottom = 'bottom' as const
export type Bottom = typeof bottom

export const left = 'left' as const
export type Left = typeof left

export const back = 'back' as const
export type Back = typeof back

export const sides = [front, top, right, bottom, left, back] as [
  Front,
  Top,
  Right,
  Bottom,
  Left,
  Back
]

export const orbit = 'orbit' as const

export type Orbit = typeof orbit

export type Side =
  | typeof front
  | typeof top
  | typeof right
  | typeof bottom
  | typeof left
  | typeof back
