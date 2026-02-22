"use client"

import { PublicHeader } from "@/components/public-header"
import { useTranslation } from "@/lib/i18n-context"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh flex-col bg-base-100">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-base-300/50 bg-base-200/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-base-content/50 md:flex-row lg:px-8">
          <p>{t("common.pevi")} &mdash; {t("common.tagline")}</p>
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} PEVI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
