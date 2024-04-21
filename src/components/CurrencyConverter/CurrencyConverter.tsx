import React, { useState, useEffect } from "react";
import { IoIosSwap } from "react-icons/io";
import Select from "../Select/Select";
import Header from "../Header/Header";
import data from "../data/data.json";
import "./Index.css";

interface Currency {
  code: string;
  name: string;
  flag: string;
}

const CurrencyConverter: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<number>(0);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const extractedCurrencies: Currency[] = data.map((country: any) => ({
      code: country.currency.code,
      name: country.currency.name,
      flag: country.currency.flag
    }));

    const uniqueCurrencies = extractedCurrencies.filter(
      (currency, index, self) =>
        index ===
        self.findIndex(
          (c) => c.code === currency.code && c.name === currency.name
        )
    );
    setCurrencies(uniqueCurrencies);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((response) => response.json())
      .then((data) => {
        const rate = data.rates[toCurrency];
        setConvertedAmount(rate ? amount * rate : null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching exchange rates:", error);
        setLoading(false);
      });
  }, [fromCurrency, toCurrency, amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(0);
    }
  };

  const handleFromCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setToCurrency(e.target.value);
  };

  const clearValues = () => {
    setAmount(0);
    setConvertedAmount(null);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="position">
          <div className="wrapper">
            <div>
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div>
              <label>From Currency:</label>
              <Select
                value={fromCurrency}
                options={currencies}
                onChange={handleFromCurrencyChange}
              />
            </div>
            <div>
              <button onClick={swapCurrencies} className="swap-button">
                <IoIosSwap />
              </button>
            </div>
            <div>
              <label>To Currency:</label>
              <Select
                value={toCurrency}
                options={currencies}
                onChange={handleToCurrencyChange}
              />
            </div>

            <div>
              <button onClick={clearValues} className="clear-btn">
                Clear
              </button>
            </div>
          </div>
          <div className="Amount">
            {loading ? (
              <p>Converting...</p>
            ) : (
              <div>
                <span className="amount-res">
                  {amount} {fromCurrency} =
                </span>
                <h2 style={{ opacity: "0.6" }}>
                  {convertedAmount != null
                    ? convertedAmount.toFixed(2) + " " + toCurrency
                    : 0}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
