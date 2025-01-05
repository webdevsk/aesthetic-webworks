import { Card } from "@/components/ui/card"

export function TrustSection() {
  return (
    <section>
      <div className="container py-huge">
        <div className="flex items-end gap-6 justify-between">
          <div className="flex max-w-2xl flex-wrap gap-6">
            <h2 className="variant-h2">Your Digital Partner</h2>
            <h4 className="variant-h4">
              We partner with companies of all sizes to solve complex business challenges and define their digital
              strategies and objectives that deliver results. We help bring ideas to life and create brands, websites &
              digital products that work.
            </h4>
            <div className="mt-huge">
              <div className="flex gap-6 items-center">
                <div className="flex items-center -space-x-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="size-[72px] rounded-full bg-black"></div>
                  ))}
                </div>
                <h5 className="variant-h5 text-muted">Brands who've trusted us...</h5>
              </div>
            </div>
          </div>

          <Card className="flex divide-x-2 p-16">
            {([[20, "Years on the market"], [500, "Satisfied Customers"]] as const).map(item => (
                <div key={item[1]} className="flex-1 p-[2vw] text-center space-y-4">
                    <h2 className="variant-h2">{item[0]}</h2>
                    <h4 className="variant-h4 whitespace-nowrap">{item[1]}</h4>
                </div>
            ))}
          </Card>
        </div>
      </div>
    </section>
  )
}
