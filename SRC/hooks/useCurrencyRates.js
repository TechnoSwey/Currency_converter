import { useState, useEffect, useCallback } from 'react';
import { currencyService } from '../services/currencyService';

export const useCurrencyRates = (baseCurrency) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await currencyService.getLatestRates(baseCurrency);
      setRates(data.rates);
      setLastUpdated(data.date);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 300000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    refetch: fetchRates
  };
};
