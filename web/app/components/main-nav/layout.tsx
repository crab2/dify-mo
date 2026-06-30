'use client'

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MainNav } from '.'
import { MAIN_CONTENT_ID, SkipNav } from './skip-nav'

type MainNavLayoutProps = {
  children: ReactNode
}

const MainNavLayout = ({
  children,
}: MainNavLayoutProps) => {
  const { t } = useTranslation('common')

  return (
    <div className="flex h-0 min-h-0 grow overflow-hidden bg-background-body [background:linear-gradient(180deg,rgb(22_119_255/0.06)_0%,rgb(22_119_255/0)_280px),var(--color-background-body)]">
      <SkipNav>{t('navigation.skipToMain')}</SkipNav>
      <MainNav />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="relative isolate flex min-w-0 grow flex-col overflow-hidden bg-background-default outline-hidden before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,rgb(22_119_255/0),rgb(22_119_255/0.36),rgb(82_196_26/0.22),rgb(22_119_255/0))] focus:outline-hidden focus-visible:outline-hidden"
      >
        {children}
      </main>
    </div>
  )
}

export default MainNavLayout
