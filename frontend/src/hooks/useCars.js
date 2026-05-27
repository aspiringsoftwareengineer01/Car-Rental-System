import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// Local high-fidelity mock database fallback
const MOCK_FLEET = [
  {
    id: 'c_tesla_s',
    make: 'Tesla',
    model: 'Model S Plaid',
    type: 'Electric',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 180,
    status: 'available',
  },
  {
    id: 'c_porsche_911',
    make: 'Porsche',
    model: '911 GT3 RS',
    type: 'Sports',
    fuelType: 'Gasoline',
    seats: 2,
    pricePerDay: 280,
    status: 'available',
  },
  {
    id: 'c_rangerover',
    make: 'Range Rover',
    model: 'Autobiography',
    type: 'SUV',
    fuelType: 'Hybrid',
    seats: 7,
    pricePerDay: 220,
    status: 'rented',
  },
  {
    id: 'c_audietron',
    make: 'Audi',
    model: 'e-tron GT',
    type: 'Electric',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 190,
    status: 'available',
  },
  {
    id: 'c_bmwm4',
    make: 'BMW',
    model: 'M4 Competition',
    type: 'Sports',
    fuelType: 'Gasoline',
    seats: 4,
    pricePerDay: 170,
    status: 'available',
  },
  {
    id: 'c_mercedesg63',
    make: 'Mercedes-AMG',
    model: 'G 63 AMG',
    type: 'SUV',
    fuelType: 'Gasoline',
    seats: 5,
    pricePerDay: 250,
    status: 'maintenance',
  },
  {
    id: 'c_lucidair',
    make: 'Lucid',
    model: 'Air Sapphire',
    type: 'Electric',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 290,
    status: 'available',
  },
  {
    id: 'c_ferrarif8',
    make: 'Ferrari',
    model: 'F8 Tributo',
    type: 'Sports',
    fuelType: 'Gasoline',
    seats: 2,
    pricePerDay: 380,
    status: 'available',
  }
];

export function useCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Scenario A: Supabase is not configured -> Fallback to Mock instantly
    if (!isSupabaseConfigured) {
      setCars(MOCK_FLEET);
      setIsMock(true);
      setLoading(false);
      return;
    }

    try {
      // Scenario B: Fetch from Supabase Table
      const { data, error } = await supabase
        .from('cars')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database naming snake_case to frontend camelCase property styles
        const formattedCars = data.map((car) => ({
          id: car.id,
          make: car.make,
          model: car.model,
          type: car.type,
          fuelType: car.fuel_type || car.fuelType || 'Gasoline',
          seats: car.seats || 5,
          pricePerDay: car.price_per_day || car.pricePerDay || 100,
          status: car.status || 'available',
        }));
        setCars(formattedCars);
        setIsMock(false);
      } else {
        // Fallback if the Supabase cars table is empty
        setCars(MOCK_FLEET);
        setIsMock(true);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to mock database:', err.message);
      setError(err.message);
      setCars(MOCK_FLEET);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, isMock, refetch: fetchCars };
}
