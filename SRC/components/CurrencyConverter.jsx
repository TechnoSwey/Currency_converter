import { useState, useMemo, useEffect } from 'react';
import { useCurrencyRates } from '../../hooks/useCurrencyRates';
import { SUPPORTED_CURRENCIES } from '../../constants/currencies';
import { Loader } from '../Loader/Loader';
import styles from './CurrencyConverter.module.css';

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  
  const { rates, loading, error, lastUpdated, refetch } = useCurrencyRates(fromCurrency);

  const convertedAmount = useMemo(() => {
    if (!amount || isNaN(amount) || !rates[toCurrency]) return '';
    
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) return '';
    
    return (numericAmount * rates[toCurrency]).toFixed(4);
  }, [amount, rates, toCurrency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (loading && Object.keys(rates).length === 0) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Currency Converter</h1>
        {lastUpdated && (
          <p className={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={refetch} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      <div className={styles.converter}>
        <div className={styles.inputGroup}>
          <label>Amount</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className={styles.amountInput}
          />
        </div>

        <div className={styles.currencyRow}>
          <div className={styles.currencyGroup}>
            <label>From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className={styles.currencySelect}
            >
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={swapCurrencies} className={styles.swapButton}>
            ⇄
          </button>

          <div className={styles.currencyGroup}>
            <label>To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className={styles.currencySelect}
            >
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {convertedAmount && (
          <div className={styles.result}>
            <h2>
              {amount} {fromCurrency} = {convertedAmount} {toCurrency}
            </h2>
            <p className={styles.rateInfo}>
              1 {fromCurrency} = {rates[toCurrency]?.toFixed(6)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
