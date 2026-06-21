import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { recognitionIntro, recognitions } from '@/lib/site-content'

export function GovernmentRecognitions({ className }: { className?: string }) {
  return (
    <section className={cn("w-full py-12 md:py-16 bg-background", className)}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Government Recognitions & Pledges
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {recognitionIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recognitions.map((recognition) => (
            <Card key={recognition.number} className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0">
                  {recognition.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {recognition.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Date: {recognition.date}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-foreground">Issued by:</span>{' '}
                  <span className="text-muted-foreground">{recognition.issuedBy}</span>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Signed by:</span>{' '}
                  <span className="text-muted-foreground">{recognition.signedBy}</span>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Purpose & Significance:
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recognition.purpose}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Key Objectives:
                </h4>
                <ul className="space-y-2">
                  {recognition.objectives.map((objective) => (
                    <li key={objective} className="text-sm text-muted-foreground flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">SKT Alignment:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recognition.alignment}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
