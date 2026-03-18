export default function ListingImage({ title, id }) {

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

  function getImageFromId(id, images) {
    if (!id) return images[0];
    const num = parseInt(id.replace(/-/g, '').substring(0, 8), 16);
    return images[num % images.length];
  }

  const titleLower = title?.toLowerCase() || '';
  let imageUrl;

  if (titleLower.includes('bedsitter') || titleLower.includes('bedsit')) {
    imageUrl = getImageFromId(id, bedsitterImages);
  } else if (titleLower.includes('2 bedroom') || titleLower.includes('two bedroom')) {
    imageUrl = getImageFromId(id, twoBedImages);
  } else {
    imageUrl = getImageFromId(id, oneBedImages);
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-48 object-cover"
      onError={(e) => {
        e.target.outerHTML = `<div style="height:192px;display:flex;align-items:center;justify-content:center;background:#374151;color:#9ca3af;font-size:14px;">🏠 Photos coming soon</div>`;
      }}
    />
  );
}