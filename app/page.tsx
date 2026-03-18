// import Hero from "@/components/home/Hero";
import HeroSlider from "@/components/home/HeroSlider";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Full-width slider — outside Container */}
      <div className="relative z-10 pt-40 md:pt-48">
        <HeroSlider />

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
