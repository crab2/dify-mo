'use client'
import type { FC } from 'react'
import type { LogoSize, LogoStyle } from './logo-config'
import { cn } from '@langgenius/dify-ui/cn'
import { DEFAULT_BRAND_NAME } from '@/constants/branding'
import useTheme from '@/hooks/use-theme'
import { basePath } from '@/utils/var'
import { logoPathMap, logoSizeMap } from './logo-config'

type DifyLogoProps = {
  style?: LogoStyle
  size?: LogoSize
  className?: string
  alt?: string
}

const DifyLogo: FC<DifyLogoProps> = ({
  style = 'default',
  size = 'medium',
  className,
  alt = DEFAULT_BRAND_NAME,
}) => {
  const { theme } = useTheme()
  const themedStyle = (theme === 'dark' && style === 'default') ? 'monochromeWhite' : style

  return (
    <img
      src={`${basePath}${logoPathMap[themedStyle]}`}
      className={cn('block object-contain', logoSizeMap[size], className)}
      alt={alt}
    />
  )
}

export default DifyLogo
