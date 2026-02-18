"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { useTranslation } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"

interface DonationItem {
  donation_id: number
  user_id: number
  campaign_id: number
  amount: number
  date: string
  hash: string | null
  campaign: { title: string }
}

export default function PaymentsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [donations, setDonations] = useState<DonationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/donations?user_id=${user.id}`)
      .then((r) => r.json())
      .then((data) => setDonations(data))
      .finally(() => setLoading(false))
  }, [user?.id])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{t("payments.title")}</h1>
        <p className="text-sm text-base-content/60">{t("payments.subtitle")}</p>
      </div>
      <Card className="border-base-300/50">
        <CardHeader><CardTitle className="text-base">{t("payments.history")}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-sm text-base-content/60">Loading...</p>
            ) : donations.length === 0 ? (
              <p className="text-sm text-base-content/60">No payments found.</p>
            ) : (
              donations.map((d) => (
                <div key={d.donation_id} className="flex items-center justify-between rounded-lg border border-base-300/50 bg-base-300/30 p-3">
                  <div>
                    <p className="text-sm font-medium text-base-content">{d.campaign.title}</p>
                    <p className="text-xs text-base-content/60">
                      {new Date(d.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-base-content">
                      {t("payments.amount", { amount: d.amount, currency: "USDC" })}
                    </span>
                    <StatusBadge status={d.hash ? "completed" : "pending"} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
