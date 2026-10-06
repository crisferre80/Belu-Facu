export const weddingConfig = {
  brideName: 'Belén',
  groomName: 'Facundo',
  // Fecha del casamiento: 14 de febrero de 2027, 18:00 hs
  weddingDate: new Date('2027-01-30T18:00:00-03:00'),
  ceremonyTime: '20:00 hs',
  partyTime: '21:00 hs',
  dressCode: 'Elegante',
  dressCodeOptions: [
    {
      title: 'Mujer',
      subtitle: 'Vestido largo elegante y sobrio',
      image: '/WhatsApp Image 2026-10-05 at 19.23.11.jpeg',
    },
    {
      title: 'Hombre',
      subtitle: 'Traje oscuro, corbata y impecable',
      image: '/WhatsApp Image 2026-10-05 at 19.23.19.jpeg',
    },
  ],
  godparents: [
    {
      role: 'Madrina',
      name: 'Hermana de la novia',
      image: '/WhatsApp Image 2026-10-05 at 19.24.55.jpeg',
    },
    {
      role: 'Padrino',
      name: 'Cosme fulanito',
      image: '/WhatsApp Image 2026-10-05 at 19.23.19.jpeg',
    },
    {
      role: 'Madrina',
      name: 'Cuñada de la novia',
      image: '/WhatsApp Image 2026-10-05 at 19.59.11.jpeg',
    },
  ],
  witnesses: [
    {
      role: 'Testigo',
      name: 'Nombre y apellido',
      image: '/WhatsApp Image 2026-10-05 at 19.24.55.jpeg',
    },
    {
      role: 'Testigo',
      name: 'Nombre y apellido',
      image: '/WhatsApp Image 2026-10-05 at 19.23.19.jpeg',
    },
  ],
  giftAlias: 'bodabelenyfacundo.',
  giftAmount: '$50.000 ARS',
  
  venueLat: -27.866792495203992,
  venueLng: -64.23816356292568,
  venueAddress: 'Santiago del Estero, Argentina',
  mapsQuery: '-27.866792495203992,-64.23816356292568',
  whatsappPhone: '543856175610',
  email: 'facundotrejo95@icloud.com',
  hashtag: 'BelenYFacundo2027',
  welcomeText:
    'Nos emociona enormemente compartir este día tan especial contigo. Tu presencia es el mejor regalo que podemos recibir.',
  storyText:
    'EL AMOR NOS ELIGIÓ Y NOSOTROS NOS ELEGIMOS PARA SIEMPRE. Con nuestros corazones llenos de ilusión, queremos compartir con ustedes el comienzo de nuestra vida juntos. Los esperamos para celebrar nuestro amor.',
  galleryImages: [
    'editada11byn.jpg',
    '_MG_0020.JPG',
    '_MG_0033.JPG',
    '_MG_0047.JPG',
    '_MG_0063.JPG',
    '_MG_0066.JPG',
    '_MG_0078.JPG',
    '_MG_0089.JPG',
    '_MG_0121.JPG',
    '_MG_0127.JPG',
    '_MG_0176.JPG',
    '_MG_0179.JPG',
    '_MG_0207.JPG',
  ].map((fileName) => `/Fotos/${encodeURI(fileName)}`),
  heroImage:
    'https://res.cloudinary.com/dhvrrxejo/image/upload/v1790565329/_MG_0127byn_ez5bly.jpg',
  bouquetImage:
    '/Fotos/_MG_0207.JPG',
};
