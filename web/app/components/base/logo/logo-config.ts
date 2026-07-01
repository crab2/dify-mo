export type LogoStyle = 'default' | 'monochromeWhite'

export const logoPathMap: Record<LogoStyle, string> = {
  default: '/logo/china-mobile-logo.png',
  monochromeWhite: '/logo/china-mobile-logo.png',
}

export type LogoSize = 'large' | 'medium' | 'small'

export const logoSizeMap: Record<LogoSize, string> = {
  large: 'w-[128px] h-10',
  medium: 'w-[112px] h-9',
  small: 'w-[84px] h-7',
}
