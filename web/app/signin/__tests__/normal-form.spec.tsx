import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRouter, useSearchParams } from '@/next/navigation'
import NormalForm from '../normal-form'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
    useSuspenseQuery: vi.fn(),
  }
})

vi.mock('@/features/account-profile/client', () => ({
  isLegacyBase401: vi.fn(() => false),
  userProfileQueryOptions: vi.fn(() => ({
    queryKey: ['account', 'profile'],
    queryFn: vi.fn(),
  })),
}))

vi.mock('@/features/system-features/client', () => ({
  systemFeaturesQueryOptions: vi.fn(() => ({
    queryKey: ['system-features'],
    queryFn: vi.fn(),
  })),
}))

vi.mock('@/next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

vi.mock('@/service/common', async () => {
  const actual = await vi.importActual<typeof import('@/service/common')>('@/service/common')
  return {
    ...actual,
    invitationCheck: vi.fn(),
  }
})

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<typeof import('react-i18next')>('react-i18next')
  const { createReactI18nextMock } = await import('@/test/i18n-mock')
  return {
    ...actual,
    ...createReactI18nextMock({
      'login.pageTitle': '登录 中国移动 AI助手',
      'login.pageTitleForE': '登录 中国移动 AI助手',
    }),
  }
})

vi.mock('./utils/post-login-redirect', () => ({
  resolvePostLoginRedirect: vi.fn(() => null),
}))

const mockReplace = vi.fn()
const mockUseQuery = vi.mocked(useQuery)
const mockUseSuspenseQuery = vi.mocked(useSuspenseQuery)
const mockUseRouter = useRouter as unknown as ReturnType<typeof vi.fn>
const mockUseSearchParams = useSearchParams as unknown as ReturnType<typeof vi.fn>

const loggedInQueryResult = {
  isPending: false,
  data: {
    profile: {
      id: 'account-id',
    },
  },
  error: null,
}

const invitationQueryResult = {
  isPending: false,
  isError: false,
  data: {
    is_valid: true,
    data: {
      workspace_name: 'Acme',
      workspace_id: 'workspace-id',
      email: 'invitee@example.com',
    },
  },
}

describe('NormalForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRouter.mockReturnValue({ replace: mockReplace })
    mockUseSearchParams.mockReturnValue(new URLSearchParams('invite_token=invite-token'))
    mockUseSuspenseQuery.mockReturnValue({
      data: {
        enable_social_oauth_login: false,
        sso_enforced_for_signin: false,
        enable_email_code_login: false,
        enable_email_password_login: true,
        is_email_setup: true,
        is_allow_register: false,
        license: {
          status: 'none',
        },
        branding: {
          enabled: true,
        },
      },
    } as unknown as ReturnType<typeof useSuspenseQuery>)
  })

  describe('Rendering', () => {
    it('should show the China Mobile AI assistant title when default branding is used', () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams())
      mockUseSuspenseQuery.mockReturnValue({
        data: {
          enable_social_oauth_login: false,
          sso_enforced_for_signin: false,
          enable_email_code_login: false,
          enable_email_password_login: false,
          is_email_setup: true,
          is_allow_register: false,
          license: {
            status: 'none',
          },
          branding: {
            enabled: false,
          },
        },
      } as unknown as ReturnType<typeof useSuspenseQuery>)
      mockUseQuery
        .mockReturnValueOnce({
          isPending: false,
          data: null,
          error: null,
        } as unknown as ReturnType<typeof useQuery>)
        .mockReturnValueOnce({
          isPending: false,
          isError: false,
          data: null,
        } as unknown as ReturnType<typeof useQuery>)

      render(<NormalForm />)

      expect(screen.getByRole('heading', { name: '登录 中国移动 AI助手' })).toBeInTheDocument()
    })
  })

  describe('Invite Redirects', () => {
    it('should send logged-in invite visitors to the invite confirmation page', async () => {
      mockUseQuery
        .mockReturnValueOnce(loggedInQueryResult as unknown as ReturnType<typeof useQuery>)
        .mockReturnValueOnce(invitationQueryResult as unknown as ReturnType<typeof useQuery>)

      render(<NormalForm />)

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/signin/invite-settings?invite_token=invite-token')
      })
    })
  })
})
