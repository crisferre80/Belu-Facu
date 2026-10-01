export const weddingConfig = {
  brideName: 'Belén',
  groomName: 'Facundo',
  // Fecha del casamiento: 14 de febrero de 2027, 18:00 hs
  weddingDate: new Date('2027-02-14T18:00:00-03:00'),
  ceremonyTime: '20:00 hs',
  partyTime: '21:00 hs',
  dressCode: 'Elegante',
  venueName: 'Sindicato de Camioneros',
  venueAddress: 'Ruta Nueve 9-El Zanjon, Santigo del Estero - Argentina',
  // Coordenadas aproximadas para el mapa (Córdoba, Argentina)
  venueLat: -31.4201,
  venueLng: -64.1888,
  mapsQuery: 'Sindicato de Camioneros+Santiago del Estero+Argentina',
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
    'https://res.cloudinary.com/dhvrrxejo/image/upload/v1790568616/_MG_0207-bordes-difuminados_bsylez.webp',
};
