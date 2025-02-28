import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useRef } from "react";
import carousel1 from "@/assets/images/auth/carousel1.svg";
import carousel2 from "@/assets/images/auth/carousel2.svg";
import carousel3 from "@/assets/images/auth/carousel3.svg";

const CarouselPlugin = () => {
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  return (
    <Card className="border-none w-full bg-[#222936]">
      <CardContent className="p-0 h-full">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="h-full">
          {[carousel1, carousel2, carousel3].map((image) => (
            <CarouselItem className="h-full">
            <div className="flex h-full items-center justify-center">
              <img 
                src={image} 
                alt="Carousel Image"
                className="w-[90%] max-h-[70%] object-contain"
              />
            </div>
          </CarouselItem>
          ))}

          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default CarouselPlugin;