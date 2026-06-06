'use client'

import { useCampaigns } from '@/lib/hooks/useApi'
import { ContentCard } from '@/components/content-card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export function CampaignsList() {
  const { campaigns, isLoading, isError } = useCampaigns()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="w-full h-48 rounded-lg" />
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-full h-4 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !campaigns.length) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Unable to load campaigns. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {campaigns.map((campaign: any) => {
        const progressPercent = campaign.goal > 0 ? (campaign.raised / campaign.goal) * 100 : 0

        return (
          <div key={campaign.slug} className="space-y-4">
            <ContentCard
              image={campaign.image}
              alt={campaign.title}
              title={campaign.title}
              description={campaign.description}
              href={`/campaigns/${campaign.slug}`}
            />

            {campaign.goal > 0 && (
              <div className="space-y-3">
                <Progress value={progressPercent} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-foreground">
                    ₹{campaign.raised.toLocaleString('en-IN')} of ₹{campaign.goal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {campaign.donors} donors
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
