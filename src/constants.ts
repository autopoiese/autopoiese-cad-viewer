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

export const frontNormal = [0, 0, 1] as const
export const topNormal = [0, 1, 0] as const
export const rightNormal = [1, 0, 0] as const
export const bottomNormal = [0, -1, 0] as const
export const leftNormal = [-1, 0, 0] as const
export const backNormal = [0, 0, -1] as const

export const lookToFront:LookAtSide = [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1] //prettier-ignore
export const lookToTop:LookAtSide = [0, -1, 0, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0, 1] //prettier-ignore
export const lookToRight:LookAtSide = [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1] //prettier-ignore
export const lookToBottom:LookAtSide =  [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1] //prettier-ignore
export const lookToLeft:LookAtSide =[0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1] //prettier-ignore
export const lookToBack:LookAtSide =[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] //prettier-ignore

export const lookFromFront: LookFromSide = lookToBack
export const lookFromTop:LookFromSide = [0, -1, 0, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0, 0, 0, 1] //prettier-ignore
export const lookFromRight: LookFromSide = lookToLeft
export const lookFromBottom:LookFromSide = [0, 1, 0, 0, 0, 0, -1, 0, -1, 0, 0, 0, 0, 0, 0, 1] //prettier-ignore
export const lookFromLeft: LookFromSide = lookToRight
export const lookFromBack: LookFromSide = lookToFront

export const lookTo = {
  [front]: lookToFront,
  [top]: lookToTop,
  [right]: lookToRight,
  [bottom]: lookToBottom,
  [left]: lookToLeft,
  [back]: lookToBack
}

export const lookFrom = {
  [front]: lookFromFront,
  [top]: lookFromTop,
  [right]: lookFromRight,
  [bottom]: lookFromBottom,
  [left]: lookFromLeft,
  [back]: lookFromBack
}

/**
 *
 * look from [0,0,0] to [x,y,z]
 *
 * transposed! ready to use matrix
 */
type LookAtSide = TransposedMatrixArray

/**
 *
 * look from [x,y,z] to [0,0,0]
 *
 * transposed! ready to use matrix
 */
type LookFromSide = TransposedMatrixArray
type N = 0 | 1 | -1
type TransposedMatrixArray = [
  /** n11 */ N,
  /** n12 */ N,
  /** n13 */ N,
  /** n14 */ N,
  /** n21 */ N,
  /** n22 */ N,
  /** n23 */ N,
  /** n24 */ N,
  /** n31 */ N,
  /** n32 */ N,
  /** n33 */ N,
  /** n34 */ N,
  /** n41 */ N,
  /** n42 */ N,
  /** n43 */ N,
  /** n44 */ N
]
