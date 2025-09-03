import { useEffect, useState, type FC } from 'react';
import './style.scss';

type Currency = {
  code: string;
  description: string;
  rate: number;
};

const CurrencyConverter: FC = () => {
  const [search, setSearch] = useState<string>('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState<number>(1);
  const [selectedRate, setSelectedRate] = useState<Currency>();

  //Création de la liste des currencies
  useEffect(() => {
    const getCurrenciesList = async () => {
      const response = await fetch(
        'https://grippy.learn.pierre-godino.com/api/mock/react-converter'
      );
      const data = await response.json();

      setCurrencies(data.rates);
    };

    // Catch afin d'informer que erreur si besoin et comme ça ne propage pas l'erreur au reste du code
    getCurrenciesList().catch((error) => console.error(`Catch error ${error}`));
  }, []);

  //Barre de recherche dans la liste
  const filteredCurrencies = currencies.filter((searchItem) => {
    return (
      searchItem.description.toLowerCase().includes(search.toLowerCase()) ||
      searchItem.code.toLowerCase().includes(search.toLowerCase())
    );
    //Peut aussi utiliser .startsWith() => mais ne sélectionnera que ce qui commence par ce qui a été tapé dans l'input
  });

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>
      <p id="currency-title">Convert from Euro (€)</p>

      <div className="amount">
        <h2>Amount</h2>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(event) => setAmount(parseFloat(event.target.value))}
        />
      </div>

      <div className="search-bar">
        <h2>Search Currency</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to filter..."
        />
      </div>

      <h2>Select Currency</h2>
      <div className="money-list">
        <ul id="currencies-list">
          {filteredCurrencies.map((currency) => (
            <li
              key={currency.code}
              className={`${
                currency.code === selectedRate?.code ? 'selected' : ''
              }`}
            >
              <button onClick={() => setSelectedRate(currency)}>
                {currency.description} ({currency.code})
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="converted-result">
        <p>{selectedRate ? (amount * selectedRate.rate).toFixed(2) : '- -'}</p>
        <p>
          {selectedRate ? selectedRate.description : 'No currency selected'}
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
