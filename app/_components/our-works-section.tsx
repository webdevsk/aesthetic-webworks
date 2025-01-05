import { HorizontalScrollTrigger } from "@/components/horizontal-scroll-trigger"

export const OurWorksSection = () => {
    return (
        <HorizontalScrollTrigger>
            <div className="flex space-x-[2.5vw]">
                <div>
                    <div className="flex items-center gap-4">
                        <h2 className="variant-h2">Our Works</h2>
                        <div className="rounded-full aspect-square size-[70px] grid place-items-center border border-muted ">
                            <h5 className="variant-h5">13</h5>
                        </div>
                    </div>
                </div>
            </div>
        </HorizontalScrollTrigger>
    )
}