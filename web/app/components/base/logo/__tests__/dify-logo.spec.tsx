import { render, screen } from '@testing-library/react'
import DifyLogo from '../dify-logo'

vi.mock('@/utils/var', () => ({
  basePath: '/test-base-path',
}))

describe('DifyLogo', () => {
  describe('Render', () => {
    it('renders correctly with default props', () => {
      render(<DifyLogo />)
      const img = screen.getByRole('img', { name: 'AI助手' })
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', '/test-base-path/logo/china-mobile-logo.png')
    })
  })

  describe('Props', () => {
    it('applies custom size correctly', () => {
      const { rerender } = render(<DifyLogo size="large" />)
      let img = screen.getByRole('img', { name: 'AI助手' })
      expect(img).toHaveClass('w-[128px]')
      expect(img).toHaveClass('h-10')

      rerender(<DifyLogo size="small" />)
      img = screen.getByRole('img', { name: 'AI助手' })
      expect(img).toHaveClass('w-[84px]')
      expect(img).toHaveClass('h-7')
    })

    it('applies custom style correctly', () => {
      render(<DifyLogo style="monochromeWhite" />)
      const img = screen.getByRole('img', { name: 'AI助手' })
      expect(img).toHaveAttribute('src', '/test-base-path/logo/china-mobile-logo.png')
    })

    it('applies custom className', () => {
      render(<DifyLogo className="custom-test-class" />)
      const img = screen.getByRole('img', { name: 'AI助手' })
      expect(img).toHaveClass('custom-test-class')
    })

    it('applies custom alt text', () => {
      const { container } = render(<DifyLogo alt="" />)
      const img = container.querySelector('img')
      expect(img).toHaveAttribute('alt', '')
    })
  })

  describe('Style behavior', () => {
    it('uses default logo when style is default', () => {
      render(<DifyLogo style="default" />)
      const img = screen.getByRole('img', { name: 'AI助手' })
      expect(img).toHaveAttribute('src', '/test-base-path/logo/china-mobile-logo.png')
    })

    it('uses monochromeWhite logo when explicitly requested', () => {
      render(<DifyLogo style="monochromeWhite" />)
      const img = screen.getByRole('img', { name: 'AI助手' })
      expect(img).toHaveAttribute('src', '/test-base-path/logo/china-mobile-logo.png')
    })
  })
})
