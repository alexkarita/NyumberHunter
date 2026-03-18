"use client";

import Button from "./Button";

export default function ListingCard({ listing, isWishlisted, onToggleWishlist, onViewDetails }) {
  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white transition-all duration-[260ms] hover:-translate-y-[3px] cursor-pointer"
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--shadow-hover)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--shadow-card)"}
    >
      {/* PHOTO — 60% of card */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={(() => {
            const bedsitterImages = [
              'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/kimbo-nibs-elegant-bedsitter-ksh6500month-axQdpbpJ7IZ9OoLAzbaL.jpg',
              'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/smart-spacious-bedsitter-for-rent-in-ruaka-JhaX9891LrOYZ4rziEig.jpg',
              'https://i.roamcdn.net/prop/brk/listing-thumb-400w/dbf8dd69489401b529703a3036b1f92e/-/prod-property-core-backend-media-brk/9104592/1101aed2-89e6-490e-b966-9d6ad51de3a3.jpg',
              'https://listings.reemioltd.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-16-at-12.55.14-1-584x438.jpeg',
              'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/bedsitter-ruiru-zerech-ne3xYgmfRh0hnLLk9UN0.jpg',
              'https://pictures-kenya.jijistatic.com/73868785_MzAwLTQwMC1kNTk2NDJhOGRmLTE.webp',
              'https://pictures-kenya.jijistatic.com/73868786_MzAwLTIyNS04NzBiNTJmOTU1LTE.webp',
              'https://pictures-kenya.jijistatic.com/73868787_MzAwLTIyNS05OWQzYmMyNzYwLTE.webp',
              'https://pictures-kenya.jijistatic.com/79307005_OTAwLTE2MDAtYjkyODA0YjA5Zg.webp',
              'https://pictures-kenya.jijistatic.com/79306999_NjI0LTE2MDAtMDQxYTAzYWZhMQ.webp',
              'https://pictures-kenya.jijistatic.com/80407630_MTIwMC0xNjAwLTIxNTc1ZmFhNzQ.webp',
              'https://pictures-kenya.jijistatic.com/80407636_MTIwMC0xNjAwLThkMDMwODc4MWU.webp',
              'https://pictures-kenya.jijistatic.com/80407642_MTIwMC0xNjAwLTk4MDg1N2M1M2I.webp',
            ];
            const oneBedImages = [
              'https://images.locanto.info/6619698798/one-bedroom-apartment-for-rent-in-Ruiru-kamakis_1.jpg',
              'https://images.kenyapropertycentre.com/properties/images/26464/0651e777260931-affordable-1-bedroom-apartments-mini-flats-for-rent-ruiru-kiambu.jpg',
              'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/bedsitter-kayole-YKY12WbkXYdqXVHxmmf5.jpg',
              'https://www.eazzyrent.com/propertyimages/00022181501.jpg',
              'https://pictures-kenya.jijistatic.com/68887788_MTYwMC0yMTM0LTUyMWVkM2RkNWE.webp',
              'https://pictures-kenya.jijistatic.com/68887793_MTYwMC0yMTM0LWY5NzEyMTlkNWI.webp',
              'https://pictures-kenya.jijistatic.com/82769810_MTA4MC0xMzUwLTM2OWJlZTkyMWY.webp',
              'https://pictures-kenya.jijistatic.com/82769811_MTA4MC0xMzUwLTE3ZGYwMGU5YmQ.webp',
              'https://pictures-kenya.jijistatic.com/81668600_MTU5OS0xNjAwLTM0ZmM5MDFmZjY.webp',
              'https://pictures-kenya.jijistatic.com/83234142_MTYwMC05MDAtOWI3YzM1YTc1NQ.webp',
              'https://pictures-kenya.jijistatic.com/83234149_MTYwMC05MDAtZWUxYzRkMmEyNg.webp',
              'https://pictures-kenya.jijistatic.com/83234151_MTYwMC05MDAtYjk0NWE3MDM1Mg.webp',
              'https://pictures-kenya.jijistatic.com/69553129_MTUwMC0yMDAwLTc1YzdiOWJhMTI.webp',
            ];
            const twoBedImages = [
              'https://images.kenyapropertycentre.com/properties/images/thumbs/47368/067fcd0133b9fd-modern-2-bedrooms-apartments-in-safari-park-for-rent-roysambu-nairobi.jpg',
              'https://images.privatepropertykenya.com/large/2-bedroom-for-rent-in-thika-road-oUAOHrr1A9et7dQpjZdu.jpg',
              'https://images.privatepropertykenya.com/large/2-bedroom-apartment-in-thika-road-4ngaEBu9BvGR63F5XutG.jpeg',
              'https://images.privatepropertykenya.com/large/affordable-2-bedroom-ensuite-apartments-for-rent-at-kes-24500month-uN7hcSG0bU0w9tLB8DpW.jpeg',
              'https://s3.us-east-2.amazonaws.com/images.propertypro.africa/large/a-own-compound-2-bedrooms-to-let-at-ruiru-kimbo-W8BtV0Kk8jDTblXiouEM.jpg',
              'https://pictures-kenya.jijistatic.com/72147693_MTIwMC0xNjAwLTY0YzE2YjZkMzUtMQ.webp',
              'https://pictures-kenya.jijistatic.com/72147696_MTIwMC0xNjAwLTJiMmI2YWQ4NzAtMQ.webp',
              'https://pictures-kenya.jijistatic.com/72147697_MTIwMC0xNjAwLTdmNzZiZmQ0M2UtMQ.webp',
              'https://pictures-kenya.jijistatic.com/79818172_MTUwMC0yMDAwLTQyZDBhOWJlYjc.webp',
              'https://pictures-kenya.jijistatic.com/79818166_MTUwMC0yMDAwLWU1ZTQ0Y2ZmMmU.webp',
              'https://pictures-kenya.jijistatic.com/67259376_MTI4MC05NjAtMmZlYTY0M2U2MQ.webp',
              'https://pictures-kenya.jijistatic.com/67259393_MTYwMC0xMjAwLWE0YmE2YTBkZjk.webp',
              'https://pictures-kenya.jijistatic.com/81068200_MTYwMC0xNjAwLTAyM2U4NTg0Nzg.webp',
              'https://pictures-kenya.jijistatic.com/75462089_NzIwLTE2MDAtZmE0OWRlM2FiNw.webp',
            ];
            const num = listing.id ? parseInt(listing.id.replace(/-/g, '').substring(0, 8), 16) : 0;
            const titleLower = listing.title?.toLowerCase() || '';
            if (titleLower.includes('bedsitter')) return bedsitterImages[num % bedsitterImages.length];
            if (titleLower.includes('2 bedroom')) return twoBedImages[num % twoBedImages.length];
            return oneBedImages[num % oneBedImages.length];
          })()}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.10), transparent)" }} />

        {/* Price + Area on photo */}
        <div className="absolute bottom-3 left-3 text-white z-10">
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-80">
            {listing.area?.replace('-', ' ')}
          </p>
          <p className="font-serif text-lg">Ksh {listing.price?.toLocaleString()}</p>
        </div>

        {/* Heart button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(listing.id); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm hover:scale-110 transition-transform"
          style={{ background: "rgba(255,255,255,0.90)", color: isWishlisted ? "var(--color-accent)" : "var(--color-text-muted)" }}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </div>

      {/* CARD BODY — 40% */}
      <div className="p-4 pb-5" onClick={() => onViewDetails(listing.id)}>
        <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text)" }}>{listing.title}</h3>
        <p className="text-xs mb-3" style={{ color: "var(--color-text-faint)" }}>📍 {listing.location}</p>

        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--color-brand-lt)", color: "var(--color-brand)" }}>
            {listing.bedrooms === 0 ? "Bedsitter" : `${listing.bedrooms} Bed`}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--color-brand-lt)", color: "var(--color-brand)" }}>
            {listing.furnished ? "Furnished" : "Unfurnished"}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
            background: listing.water_reliability === "Reliable" ? "#E6F4EA" : "#FFF8E1",
            color: listing.water_reliability === "Reliable" ? "#2E7D32" : "#F57F17"
          }}>
            💧 {listing.water_reliability}
          </span>
        </div>

        <Button variant="primary" onClick={() => onViewDetails(listing.id)} className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}