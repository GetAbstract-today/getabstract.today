import Image from "next/image";

export interface ArticleCardProps {
  imageSrc: string;
  imageAlt: string;
  dateRead: string;
  title: string;
  description: string;
  href?: string;
}

export function ArticleCard({
  imageSrc,
  imageAlt,
  dateRead,
  title,
  description,
  href = "#",
}: ArticleCardProps) {
  const content = (
    <>
      <div className="h-48 border-beam-b overflow-hidden relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={384}
          height={192}
          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-300"
          unoptimized={imageSrc.includes("supabase.co") || imageSrc.includes("unsplash.com")}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="font-tech text-[10px] text-gray-500 mb-2 uppercase tracking-widest">
          {dateRead}
        </div>
        <h3 className="font-bold text-xl uppercase leading-snug mb-4 group-hover:text-[#FF3300] transition-colors">
          {title}
        </h3>
        <p className="text-sm font-medium leading-relaxed opacity-80 mt-auto">
          {description}
        </p>
      </div>
    </>
  );

  return (
    <article className="w-80 md:w-96 shrink-0 border-beam bg-white group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 snap-start flex flex-col cursor-pointer">
      {href !== "#" ? (
        <a href={href} className="flex flex-col flex-grow">
          {content}
        </a>
      ) : (
        content
      )}
    </article>
  );
}
