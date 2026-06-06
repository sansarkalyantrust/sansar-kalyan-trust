interface PageHeroProps {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(45, 106, 79, 0.9) 0%, rgba(82, 183, 136, 0.9) 100%), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
      )}

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-white/90 font-medium max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
