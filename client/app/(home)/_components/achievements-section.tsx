export function AchievementsSection() {
  return (
    <section>
      <div className="container py-huge">
        <div className="flex items-end justify-between gap-8">
          <div>
            <h2 className="variant-h2 max-w-screen-lg">Let our experienced team elevate your digital goals</h2>
            <div className="mt-huge flex items-center gap-16">
              {(
                [
                  [250, "Five-Star Reviews"],
                  [10, "In-House Experts"],
                ] as const
              ).map(([q, d]) => (
                <div key={d} className="space-y-8">
                  <h2 className="variant-h2 whitespace-nowrap">{q}</h2>
                  <h4 className="variant-h4 whitespace-nowrap">{d}</h4>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-[35.625vw]">
            <h4 className="variant-h4">
              We have successfully completed over 300+ projects from a variety of industries. In our team, designers
              work alongside developers and digital strategists, we believe this is our winning recipe for creating
              digital products that make an impact.
            </h4>
          </div>
        </div>
      </div>
    </section>
  )
}
