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
    pricePerDay: 5180,
    status: 'available',
  },
  {
    id: 'c_porsche_911',
    make: 'Porsche',
    model: '911 GT3 RS',
    type: 'Sports',
    fuelType: 'Gasoline',
    seats: 2,
    pricePerDay: 5280,
    status: 'available',
  },
  {
    id: 'c_rangerover',
    make: 'Range Rover',
    model: 'Autobiography',
    type: 'SUV',
    fuelType: 'Hybrid',
    seats: 7,
    pricePerDay: 5220,
    status: 'rented',
  },
  {
    id: 'c_audietron',
    make: 'Audi',
    model: 'e-tron GT',
    type: 'Electric',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 5190,
    status: 'available',
  },
  {
    id: 'c_bmwm4',
    make: 'BMW',
    model: 'M4 Competition',
    type: 'Sports',
    fuelType: 'Gasoline',
    seats: 4,
    pricePerDay: 5170,
    status: 'available',
  },
  {
    id: 'c_mercedesg63',
    make: 'Mercedes-AMG',
    model: 'G 63 AMG',
    type: 'SUV',
    fuelType: 'Gasoline',
    seats: 5,
    pricePerDay: 5250,
    status: 'maintenance',
  },
  {
    id: 'c_lucidair',
    make: 'Lucid',
    model: 'Air Sapphire',
    type: 'Electric',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 5290,
    status: 'available',
  },
  {
    id: 'c_ferrarif8',
    make: 'Ferrari',
    model: 'F8 Tributo',
    type: 'Sports',
    fuelType: 'Gasoline',
    seats: 2,
    pricePerDay: 5380,
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

    // Scenario A: Supabase is not configured -> Fallback to Mock / LocalStorage instantly
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('antigravity_cars_v2');
      if (stored) {
        setCars(JSON.parse(stored));
      } else {
        setCars(MOCK_FLEET);
        localStorage.setItem('antigravity_cars_v2', JSON.stringify(MOCK_FLEET));
      }
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
        const stored = localStorage.getItem('antigravity_cars_v2');
        if (stored) {
          setCars(JSON.parse(stored));
        } else {
          setCars(MOCK_FLEET);
          localStorage.setItem('antigravity_cars_v2', JSON.stringify(MOCK_FLEET));
        }
        setIsMock(true);
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to mock database:', err.message);
      setError(err.message);
      const stored = localStorage.getItem('antigravity_cars_v2');
      if (stored) {
        setCars(JSON.parse(stored));
      } else {
        setCars(MOCK_FLEET);
        localStorage.setItem('antigravity_cars_v2', JSON.stringify(MOCK_FLEET));
      }
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Administrative Add Car Action
  const addCar = async (carData) => {
    const newCar = {
      id: carData.id || 'c_' + Math.random().toString(36).substr(2, 9),
      make: carData.make,
      model: carData.model,
      type: carData.type,
      fuelType: carData.fuelType || 'Gasoline',
      seats: Number(carData.seats) || 5,
      pricePerDay: Number(carData.pricePerDay),
      status: carData.status || 'available'
    };

    if (!isSupabaseConfigured) {
      // LocalStorage Engine
      try {
        const stored = localStorage.getItem('antigravity_cars_v2');
        const fleet = stored ? JSON.parse(stored) : MOCK_FLEET;
        fleet.unshift(newCar);
        localStorage.setItem('antigravity_cars_v2', JSON.stringify(fleet));
        setCars(fleet);
        return { success: true, data: newCar };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    try {
      // Map camelCase to snake_case for Supabase
      const supabasePayload = {
        id: newCar.id,
        make: newCar.make,
        model: newCar.model,
        type: newCar.type,
        fuel_type: newCar.fuelType,
        seats: newCar.seats,
        price_per_day: newCar.pricePerDay,
        status: newCar.status
      };

      const { data, error } = await supabase
        .from('cars')
        .insert([supabasePayload])
        .select();

      if (error) throw error;

      fetchCars(); // Refresh local hook state
      return { success: true, data: data[0] };
    } catch (err) {
      console.warn('Supabase car save failed, falling back to localStorage:', err.message);
      
      // Fallback
      const stored = localStorage.getItem('antigravity_cars_v2');
      const fleet = stored ? JSON.parse(stored) : MOCK_FLEET;
      fleet.unshift(newCar);
      localStorage.setItem('antigravity_cars_v2', JSON.stringify(fleet));
      setCars(fleet);
      return { success: true, data: newCar };
    }
  };

  // Administrative Delete Car Action
  const deleteCar = async (carId) => {
    if (!isSupabaseConfigured) {
      // LocalStorage Engine
      try {
        const stored = localStorage.getItem('antigravity_cars_v2');
        let fleet = stored ? JSON.parse(stored) : MOCK_FLEET;
        fleet = fleet.filter(c => c.id !== carId);
        localStorage.setItem('antigravity_cars_v2', JSON.stringify(fleet));
        setCars(fleet);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      fetchCars(); // Refresh local hook state
      return { success: true };
    } catch (err) {
      console.warn('Supabase car delete failed, updating localStorage backup:', err.message);
      
      // Fallback
      const stored = localStorage.getItem('antigravity_cars_v2');
      let fleet = stored ? JSON.parse(stored) : MOCK_FLEET;
      fleet = fleet.filter(c => c.id !== carId);
      localStorage.setItem('antigravity_cars_v2', JSON.stringify(fleet));
      setCars(fleet);
      return { success: true };
    }
  };

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, isMock, addCar, deleteCar, refetch: fetchCars };
}
