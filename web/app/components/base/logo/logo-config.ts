export type LogoStyle = 'default' | 'monochromeWhite'

export const logoPathMap: Record<LogoStyle, string> = {
  default: '/logo/logo.svg',
  monochromeWhite: '/logo/logo-monochrome-white.svg',
}

export type LogoSize = 'large' | 'medium' | 'small'

export const logoSizeMap: Record<LogoSize, string> = {
  large: 'w-[104px] h-8',
  medium: 'w-[96px] h-7',
  small: 'w-[72px] h-5',
}
