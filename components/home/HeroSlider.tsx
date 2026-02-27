"use client";

import { useQuery } from "@apollo/client";
import { GET_ACTIVE_BANNERS } from "@/lib/graphql/queries";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import styles from './HeroSlider.module.css';

interface Banner {
    id: string;
    title?: string;
    image: string;
    link?: string;
    order: number;
}

const HeroSlider = () => {
    const { data, loading } = useQuery<{ activeBanners: Banner[] }>(GET_ACTIVE_BANNERS);
    const banners = data?.activeBanners || [];

    if (loading || banners.length === 0) {
        return null;
    }

    return (
        <div className={styles.heroSlider}>
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                loop={banners.length > 1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                effect="fade"
                fadeEffect={{
                    crossFade: true
                }}
                speed={800}
                className={styles.swiper}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id} className={styles.slide}>
                        {banner.link ? (
                            <Link href={banner.link} className={styles.slideLink}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        fill
                                        sizes="100vw"
                                        className={styles.image}
                                        priority
                                        quality={90}
                                    />
                                    <div className={styles.overlay} />
                                </div>
                                {banner.title && (
                                    <div className={styles.titleWrapper}>
                                        <h2 className={styles.title}>{banner.title}</h2>
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <div className={styles.slideContent}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || 'Banner'}
                                        fill
                                        sizes="100vw"
                                        className={styles.image}
                                        priority
                                        quality={90}
                                    />
                                    <div className={styles.overlay} />
                                </div>
                                {banner.title && (
                                    <div className={styles.titleWrapper}>
                                        <h2 className={styles.title}>{banner.title}</h2>
                                    </div>
                                )}
                            </div>
                        )}
                    </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                {banners.length > 1 && (
                    <>
                        <div className="swiper-button-prev-custom">
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="swiper-button-next-custom">
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </>
                )}
            </Swiper>
        </div>
    );
};

export default HeroSlider;