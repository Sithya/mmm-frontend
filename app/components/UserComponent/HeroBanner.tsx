type HeroBannerProps = {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  
  export default function HeroBanner({
    title,
    subtitle,
    imageUrl,
  }: HeroBannerProps) {
    return (
      <div
        className="relative h-96 flex items-center justify-center text-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
  
        {/* Text */}
        <div className="relative z-10 text-white">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {title}
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-90">
            {subtitle}
          </p>
        </div>
      </div>
    );
  }
  