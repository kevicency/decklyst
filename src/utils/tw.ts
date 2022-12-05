import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js' // Fix the path

const config = resolveConfig(tailwindConfig)

export const theme = config.theme as unknown as Theme
// ;(typeof window !== undefined && (window as any)).__TW_THEME__ = theme
// console.log('theme', theme)

export interface Theme {
  container: Container
  colors: AccentColor
  screens: Screens
  supports: Supports
  columns: { [key: string]: string }
  spacing: { [key: string]: string }
  animation: Animation
  aria: Aria
  aspectRatio: AspectRatio
  backdropBlur: BackdropBlur
  backdropBrightness: { [key: string]: string }
  backdropContrast: { [key: string]: string }
  backdropGrayscale: BackdropGrayscale
  backdropHueRotate: { [key: string]: string }
  backdropInvert: BackdropGrayscale
  backdropOpacity: Opacity
  backdropSaturate: { [key: string]: string }
  backdropSepia: BackdropGrayscale
  backgroundColor: AccentColor
  backgroundImage: BackgroundImage
  backgroundOpacity: Opacity
  backgroundPosition: Position
  backgroundSize: BackgroundSize
  blur: BackdropBlur
  brightness: { [key: string]: string }
  borderColor: AccentColor
  borderOpacity: Opacity
  borderRadius: BackdropBlur
  borderSpacing: { [key: string]: string }
  borderWidth: BorderWidth
  boxShadow: BoxShadow
  boxShadowColor: AccentColor
  caretColor: AccentColor
  accentColor: AccentColor
  contrast: { [key: string]: string }
  content: Content
  cursor: { [key: string]: string }
  divideColor: AccentColor
  divideOpacity: Opacity
  divideWidth: BorderWidth
  dropShadow: DropShadow
  fill: AccentColor
  grayscale: BackdropGrayscale
  hueRotate: { [key: string]: string }
  invert: BackdropGrayscale
  flex: Flex
  flexBasis: { [key: string]: string }
  flexGrow: BackdropGrayscale
  flexShrink: BackdropGrayscale
  fontFamily: FontFamily
  fontSize: { [key: string]: Array<FontSizeClass | string> }
  fontWeight: FontWeight
  gap: { [key: string]: string }
  gradientColorStops: AccentColor
  gridAutoColumns: GridAuto
  gridAutoRows: GridAuto
  gridColumn: { [key: string]: string }
  gridColumnEnd: { [key: string]: string }
  gridColumnStart: { [key: string]: string }
  gridRow: GridRow
  gridRowStart: Grid
  gridRowEnd: Grid
  gridTemplateColumns: { [key: string]: string }
  gridTemplateRows: Grid
  height: { [key: string]: string }
  inset: { [key: string]: string }
  keyframes: Keyframes
  letterSpacing: LetterSpacing
  lineHeight: LineHeight
  listStyleType: ListStyleType
  margin: { [key: string]: string }
  maxHeight: { [key: string]: string }
  maxWidth: { [key: string]: string }
  minHeight: Min
  minWidth: Min
  objectPosition: Position
  opacity: Opacity
  order: { [key: string]: string }
  padding: { [key: string]: string }
  placeholderColor: AccentColor
  placeholderOpacity: Opacity
  outlineColor: AccentColor
  outlineOffset: { [key: string]: string }
  outlineWidth: { [key: string]: string }
  ringColor: AccentColor
  ringOffsetColor: AccentColor
  ringOffsetWidth: { [key: string]: string }
  ringOpacity: Opacity
  ringWidth: BorderWidth
  rotate: Rotate
  saturate: { [key: string]: string }
  scale: Scale
  scrollMargin: { [key: string]: string }
  scrollPadding: { [key: string]: string }
  sepia: BackdropGrayscale
  skew: { [key: string]: string }
  space: { [key: string]: string }
  stroke: AccentColor
  strokeWidth: { [key: string]: string }
  textColor: AccentColor
  textDecorationColor: AccentColor
  textDecorationThickness: TextDecorationThickness
  textUnderlineOffset: BorderWidth
  textIndent: { [key: string]: string }
  textOpacity: Opacity
  transformOrigin: TransformOrigin
  transitionDelay: { [key: string]: string }
  transitionDuration: { [key: string]: string }
  transitionProperty: TransitionProperty
  transitionTimingFunction: TionTimingFunction
  translate: { [key: string]: string }
  width: { [key: string]: string }
  willChange: WillChange
  zIndex: ZIndex
  gridTemplateAreas: GridTemplateAreas
  animationDelay: { [key: string]: string }
  animationDuration: { [key: string]: string }
  animationTimingFunction: TionTimingFunction
  animationFillMode: AnimationFillMode
  animationDirection: AnimationDirection
  animationOpacity: Opacity
  animationTranslate: { [key: string]: string }
  animationScale: Scale
  animationRotate: Rotate
  animationRepeat: AnimationRepeat
}

export interface AccentColor {
  inherit: Inherit
  transparent: Transparent
  current: Current
  red: { [key: string]: string }
  green: { [key: string]: string }
  amber: { [key: string]: string }
  gray: { [key: string]: string }
  alt: { [key: string]: string }
  accent: { [key: string]: string }
  mana: Mana
  attack: Attack
  health: Danger
  danger: Danger
  lyonar: Lyonar
  songhai: Songhai
  vetruvian: Vetruvian
  abyssian: Abyssian
  magmar: Magmar
  vanar: Vanar
  neutral: Common
  common: Common
  basic: Basic
  rare: Rare
  epic: Abyssian
  legendary: Legendary
  auto?: string
  DEFAULT?: string
  none?: string
}

export enum Abyssian {
  Bf20E1 = '#bf20e1',
}

export enum Attack {
  Fbbf24 = '#fbbf24',
}

export enum Basic {
  D4D4D4 = '#d4d4d4',
}

export enum Common {
  F5F5F5 = '#f5f5f5',
}

export enum Current {
  CurrentColor = 'currentColor',
}

export enum Danger {
  Dc2626 = '#dc2626',
}

export enum Inherit {
  Inherit = 'inherit',
}

export enum Legendary {
  E39F28 = '#e39f28',
}

export enum Lyonar {
  E5C56D = '#e5c56d',
}

export enum Magmar {
  The3Db586 = '#3db586',
}

export enum Mana {
  The2Ba9D8 = '#2ba9d8',
}

export enum Rare {
  The396CFD = '#396cfd',
}

export enum Songhai {
  Db4460 = '#db4460',
}

export enum Transparent {
  Transparent = 'transparent',
}

export enum Vanar {
  The2Ba3DB = '#2ba3db',
}

export enum Vetruvian {
  Db8E2B = '#db8e2b',
}

export interface Animation {
  none: string
  spin: string
  ping: string
  pulse: string
  bounce: string
}

export interface AnimationDirection {
  normal: string
  reverse: string
  alternate: string
  'alternate-reverse': string
}

export interface AnimationFillMode {
  none: string
  forwards: string
  backwards: string
  both: string
}

export interface Opacity {
  '0': string
  '5': string
  '10': string
  '20': string
  '25': string
  '30': string
  '40': string
  '50': string
  '60': string
  '70': string
  '75': string
  '80': string
  '90': string
  '95': string
  '100': string
  DEFAULT?: number | string
}

export interface AnimationRepeat {
  '0': string
  '1': string
  infinite: string
}

export interface Rotate {
  '0': string
  '1': string
  '2': string
  '3': string
  '6': string
  '12': string
  '45': string
  '90': string
  '180': string
  DEFAULT?: string
}

export interface Scale {
  '0': string
  '50': string
  '75': string
  '90': string
  '95': string
  '100': string
  '101': string
  '105': string
  '110': string
  '125': string
  '130': string
  '135': string
  '150': string
  '200': string
  DEFAULT?: number
}

export interface TionTimingFunction {
  DEFAULT: string
  linear: string
  in: string
  out: string
  'in-out': string
}

export interface Aria {
  checked: string
  disabled: string
  expanded: string
  hidden: string
  pressed: string
  readonly: string
  required: string
  selected: string
}

export interface AspectRatio {
  auto: string
  square: string
  video: string
}

export interface BackdropBlur {
  '0'?: string
  none: string
  sm: string
  DEFAULT: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  full?: string
}

export interface BackdropGrayscale {
  '0': string
  DEFAULT: string
}

export interface BackgroundImage {
  none: string
  'gradient-to-t': string
  'gradient-to-tr': string
  'gradient-to-r': string
  'gradient-to-br': string
  'gradient-to-b': string
  'gradient-to-bl': string
  'gradient-to-l': string
  'gradient-to-tl': string
}

export interface Position {
  bottom: string
  center: string
  left: string
  'left-bottom': string
  'left-top': string
  right: string
  'right-bottom': string
  'right-top': string
  top: string
}

export interface BackgroundSize {
  auto: string
  cover: string
  contain: string
}

export interface BorderWidth {
  '0': string
  '2': string
  '3'?: string
  '4': string
  '8': string
  DEFAULT?: string
  '1'?: string
  auto?: string
}

export interface BoxShadow {
  sm: string
  DEFAULT: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  none: string
  nav: string
  header: string
}

export interface Container {
  center: boolean
}

export interface Content {
  none: string
}

export interface DropShadow {
  sm: string
  DEFAULT: string[]
  md: string[]
  lg: string[]
  xl: string[]
  '2xl': string
  none: string
}

export interface Flex {
  '1': string
  auto: string
  initial: string
  none: string
}

export interface FontFamily {
  sans: string[]
  serif: string[]
  mono: string[]
}

export interface FontSizeClass {
  lineHeight: string
}

export interface FontWeight {
  thin: string
  extralight: string
  light: string
  normal: string
  medium: string
  semibold: string
  bold: string
  extrabold: string
  black: string
}

export interface GridAuto {
  auto: string
  min: string
  max: string
  fr: string
}

export interface GridRow {
  auto: string
  'span-1': string
  'span-2': string
  'span-3': string
  'span-4': string
  'span-5': string
  'span-6': string
  'span-full': string
}

export interface Grid {
  '1': string
  '2': string
  '3': string
  '4': string
  '5': string
  '6': string
  '7'?: string
  auto?: string
  none?: string
  desktop?: string
}

export interface GridTemplateAreas {
  desktop: string[]
}

export interface Keyframes {
  spin: Spin
  ping: Ping
  pulse: Pulse
  bounce: { [key: string]: Bounce }
  enter: Enter
  exit: Exit
}

export interface Bounce {
  transform: string
  animationTimingFunction: string
}

export interface Enter {
  from: From
}

export interface From {
  opacity: string
  transform: string
}

export interface Exit {
  to: From
}

export interface Ping {
  '75%, 100%': From
}

export interface Pulse {
  '50%': The50
}

export interface The50 {
  opacity: string
}

export interface Spin {
  to: To
}

export interface To {
  transform: string
}

export interface LetterSpacing {
  tighter: string
  tight: string
  normal: string
  wide: string
  wider: string
  widest: string
}

export interface LineHeight {
  '3': string
  '4': string
  '5': string
  '6': string
  '7': string
  '8': string
  '9': string
  '10': string
  none: string
  tight: string
  snug: string
  normal: string
  relaxed: string
  loose: string
}

export interface ListStyleType {
  none: string
  disc: string
  decimal: string
}

export interface Min {
  '0': string
  full: string
  screen?: string
  min: string
  max: string
  fit: string
}

export interface Screens {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface Supports {}

export interface TextDecorationThickness {
  '0': string
  '1': string
  '2': string
  '4': string
  '8': string
  auto: string
  'from-font': string
}

export interface TransformOrigin {
  center: string
  top: string
  'top-right': string
  right: string
  'bottom-right': string
  bottom: string
  'bottom-left': string
  left: string
  'top-left': string
}

export interface TransitionProperty {
  none: string
  all: string
  DEFAULT: string
  colors: string
  opacity: string
  shadow: string
  transform: string
}

export interface WillChange {
  auto: string
  scroll: string
  contents: string
  transform: string
}

export interface ZIndex {
  '0': string
  '10': string
  '20': string
  '30': string
  '40': string
  '50': string
  auto: string
}
