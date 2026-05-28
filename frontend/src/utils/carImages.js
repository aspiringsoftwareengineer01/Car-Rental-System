/**
 * Helper utility to map database car IDs to local premium PNG assets.
 * Returns a high-quality default fallback image if the ID is not found.
 */
export function getCarImage(carId) {
  const images = {
    c_tesla_s: '/images/tesla_model_s.png',
    c_porsche_911: '/images/porsche_911.png',
    c_rangerover: '/images/range_rover.png',
    c_audietron: '/images/audi_etron.png',
    c_bmwm4: '/images/bmw_m4.png',
    c_mercedesg63: '/images/mercedes_g63.png',
    c_lucidair: '/images/lucid_air.png',
    c_ferrarif8: '/images/ferrari_f8.png',
  };

  return images[carId] || '/images/default_car.png';
}
