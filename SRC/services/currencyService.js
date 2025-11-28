import { apiClient } from './apiClient';

export class CurrencyService {
  async getLatestRates(baseCurrency) {
    const data = await apiClient.request('/latest', {
      base: baseCurrency
    });

    if (!data.success) {
      throw new Error('Failed to fetch rates');
    }

    return {
      rates: data.rates,
      date: new Date(data.date),
      base: data.base
    };
  }

  async convertAmount(amount, fromCurrency, toCurrency) {
    const data = await apiClient.request('/convert', {
      from: fromCurrency,
      to: toCurrency,
      amount: amount
    });

    if (!data.success) {
      throw new Error('Conversion failed');
    }

    return data.result;
  }
}

export const currencyService = new CurrencyService();
