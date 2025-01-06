export function EstablishedYearSection() {
  return (
    <section>
      <div className="container py-huge relative">
        <div className="grid place-items-center">
          <h1 className="text-[5.625vw] variant-h1 max-w-screen-md">
            <span>Crafting digital</span>
            {" "}
            <span className="ms-[7vw] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              experiences 
            </span>
            {" "}
            <span>since 2004</span>
          </h1>
        </div>

        <div className="absolute inset-0 grid grid-cols-2 -z-10 bg-repeat-round bg-[size:40%_center]">
    <div className="bg-cover bg-no-repeat bg-[position:100%_center] relative"  style={{backgroundImage: "url(/section-bg.svg)"}}>
    <div className="bg-gradient-to-r from-white to-transparent absolute inset-y-0 w-1/2"></div>
    </div>
    <div className="bg-cover bg-no-repeat bg-[position:0%_center] relative"  style={{backgroundImage: "url(/section-bg.svg)"}}>
    <div className="bg-gradient-to-r from-transparent to-white absolute right-0 inset-y-0 w-1/2"></div>
    </div>
        </div>
      </div>
    </section>
  )
}
