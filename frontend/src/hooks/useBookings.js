import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function useBookings() {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings associated with active user
  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      // Offline LocalStorage Mode
      try {
        const stored = localStorage.getItem('antigravity_bookings');
        const allBookings = stored ? JSON.parse(stored) : [];
        // Filter bookings belonging to current user email, unless admin
        const userBookings = isAdmin ? allBookings : allBookings.filter(b => b.userEmail === user.email);
        setBookings(userBookings);
      } catch (err) {
        console.error('Failed to parse mock bookings:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      // Live Supabase query
      let query = supabase
        .from('bookings')
        .select(`
          id,
          user_email,
          car_id,
          pickup_date,
          return_date,
          total_price,
          status,
          created_at
        `);

      if (!isAdmin) {
        query = query.eq('user_email', user.email);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Map snake_case to camelCase
      const formatted = data.map(b => ({
        id: b.id,
        userEmail: b.user_email,
        carId: b.car_id,
        pickupDate: b.pickup_date,
        returnDate: b.return_date,
        totalPrice: b.total_price,
        status: b.status || 'confirmed',
        createdAt: b.created_at
      }));

      setBookings(formatted);
    } catch (err) {
      console.warn('Supabase booking query failed, using localStorage backup:', err.message);
      setError(err.message);
      
      // Fallback
      const stored = localStorage.getItem('antigravity_bookings');
      const allBookings = stored ? JSON.parse(stored) : [];
      const userBookings = isAdmin ? allBookings : allBookings.filter(b => b.userEmail === user.email);
      setBookings(userBookings);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Create booking operation
  const createBooking = async (bookingData) => {
    if (!user) {
      toast.error('You must be signed in to reserve a vehicle.');
      return { success: false, error: 'User unauthenticated' };
    }

    const newId = 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const payload = {
      id: newId,
      userEmail: user.email,
      carId: bookingData.carId,
      pickupDate: bookingData.pickupDate,
      returnDate: bookingData.returnDate,
      totalPrice: Number(bookingData.totalPrice),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Date range validation checks (overlap)
    const isOverlapping = bookings.some(b => {
      if (b.carId !== bookingData.carId || b.status === 'cancelled') return false;
      const bStart = new Date(b.pickupDate);
      const bEnd = new Date(b.returnDate);
      const pStart = new Date(bookingData.pickupDate);
      const pEnd = new Date(bookingData.returnDate);
      return pStart <= bEnd && pEnd >= bStart;
    });

    if (isOverlapping) {
      toast.error('This vehicle is already reserved for the selected dates.');
      return { success: false, error: 'Date overlap conflict' };
    }

    if (!isSupabaseConfigured) {
      // LocalStorage Engine
      try {
        const stored = localStorage.getItem('antigravity_bookings');
        const allBookings = stored ? JSON.parse(stored) : [];
        allBookings.unshift(payload);
        localStorage.setItem('antigravity_bookings', JSON.stringify(allBookings));
        setBookings(prev => [payload, ...prev]);
        toast.success('Vehicle reserved successfully (pending verification)! ⌛');
        return { success: true, data: payload };
      } catch (err) {
        toast.error('Failed to store reservation.');
        return { success: false, error: err.message };
      }
    }

    try {
      // Map camelCase to snake_case for Supabase
      const supabasePayload = {
        user_email: user.email,
        car_id: bookingData.carId,
        pickup_date: bookingData.pickupDate,
        return_date: bookingData.returnDate,
        total_price: Number(bookingData.totalPrice),
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([supabasePayload])
        .select();

      if (error) throw error;

      const inserted = data[0];
      const formatted = {
        id: inserted.id,
        userEmail: inserted.user_email,
        carId: inserted.car_id,
        pickupDate: inserted.pickup_date,
        returnDate: inserted.return_date,
        totalPrice: Number(inserted.total_price),
        status: inserted.status || 'confirmed',
        createdAt: inserted.created_at
      };

      toast.success('Vehicle reserved successfully (pending verification)! ⌛');
      fetchBookings(); // Reload
      return { success: true, data: formatted };
    } catch (err) {
      console.warn('Supabase booking save failed, falling back to localStorage:', err.message);
      
      // LocalStorage Backup
      const stored = localStorage.getItem('antigravity_bookings');
      const allBookings = stored ? JSON.parse(stored) : [];
      allBookings.unshift(payload);
      localStorage.setItem('antigravity_bookings', JSON.stringify(allBookings));
      setBookings(prev => [payload, ...prev]);
      
      toast.success('Vehicle reserved (offline sandbox backup)! 🎉');
      return { success: true, data: payload };
    }
  };

  // Cancel booking operation
  const cancelBooking = async (bookingId) => {
    if (!user) return { success: false };

    if (!isSupabaseConfigured) {
      // LocalStorage Engine
      try {
        const stored = localStorage.getItem('antigravity_bookings');
        let allBookings = stored ? JSON.parse(stored) : [];
        allBookings = allBookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b);
        localStorage.setItem('antigravity_bookings', JSON.stringify(allBookings));
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        toast.success('Reservation cancelled successfully.');
        return { success: true };
      } catch (err) {
        toast.error('Failed to cancel reservation.');
        return { success: false, error: err.message };
      }
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Reservation cancelled successfully.');
      fetchBookings(); // Reload
      return { success: true };
    } catch (err) {
      console.warn('Supabase cancel failed, updating localStorage backup:', err.message);
      
      // Fallback
      const stored = localStorage.getItem('antigravity_bookings');
      let allBookings = stored ? JSON.parse(stored) : [];
      allBookings = allBookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b);
      localStorage.setItem('antigravity_bookings', JSON.stringify(allBookings));
      
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      toast.success('Reservation cancelled (offline sandbox backup).');
      return { success: true };
    }
  };

  // Verify booking operation
  const verifyBooking = async (bookingId) => {
    if (!user) return { success: false };

    if (!isSupabaseConfigured) {
      // LocalStorage Engine
      try {
        const stored = localStorage.getItem('antigravity_bookings');
        let allBookings = stored ? JSON.parse(stored) : [];
        allBookings = allBookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b);
        localStorage.setItem('antigravity_bookings', JSON.stringify(allBookings));
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
        toast.success('Reservation verified successfully! 🎉');
        return { success: true };
      } catch (err) {
        toast.error('Failed to verify reservation.');
        return { success: false, error: err.message };
      }
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Reservation verified successfully! 🎉');
      fetchBookings(); // Reload
      return { success: true };
    } catch (err) {
      console.warn('Supabase verify failed, updating localStorage backup:', err.message);
      
      // Fallback
      const stored = localStorage.getItem('antigravity_bookings');
      let allBookings = stored ? JSON.parse(stored) : [];
      allBookings = allBookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b);
      localStorage.setItem('antigravity_bookings', JSON.stringify(allBookings));
      
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
      toast.success('Reservation verified (offline sandbox backup). 🎉');
      return { success: true };
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, createBooking, cancelBooking, verifyBooking, refetch: fetchBookings };
}
