import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { keyPrograms } from '@/lib/site-content'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const programImages = [
  '/Activity3.jpeg',
  '/medicine_camp.jpeg',
  '/Activity-cloth-help.jpeg',
]

export function CampaignsList() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {keyPrograms.map((program, index) => (
        <Card key={program.title} className="overflow-hidden flex flex-col">
          <div className="aspect-video bg-muted overflow-hidden">
            <img
              src={programImages[index]}
              alt={program.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-sm text-primary font-semibold mb-1">
              {program.heading}
            </p>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {program.title}
            </h2>
            <p className="text-primary font-semibold mb-4">{program.quote}</p>
            <ul className="space-y-2 mb-6">
              {program.points.map((point) => (
                <li key={point} className="text-sm text-muted-foreground flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Link href="/donate" className="mt-auto">
              <Button variant="outline" className="gap-2 w-full">
                Support Program <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}
