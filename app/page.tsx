// import Hero from "@/components/home/Hero";
import HeroSlider from "@/components/home/HeroSlider";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 mt-48">
        <Container>
          <HeroSlider />
        </Container>
        {/* <Hero /> */}

        <Categories />

        {/* Best Selling Products */}
        <FeaturedProducts
          title="اكثر المنتجات مبيعا"
          take={4}
          sortBy="BEST_SELLING"
        />

        <PromoBanner />

        {/* Latest Products */}
        <FeaturedProducts
          title="احدث المنتجات"
          take={4}
          sortBy="LATEST"
        />
      </div>
    </main>
  );
}
