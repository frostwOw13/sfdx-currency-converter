import { LightningElement, api, track } from 'lwc';

export default class Exchangeapp extends LightningElement {
  @api rates;
  @api currentRateSymbol;

  @track userValue;
  @track resultValue;

  ratesArray;
  page = 1;
  max_number_on_page = 8;

  handlePrevious() {
    if (this.page > 1) {
      this.page = this.page - 1;
      this.refreshRates();
    }
  }

  handleNext() {
    if (this.page < 21) {
      this.page = this.page + 1;
      this.refreshRates();
    }
  }

  handleChange (e) {
    this.userValue = e.target.value;
  }

  convertValues () {
    if (this.userValue) {
      let currentRateValue;
      this.rates.forEach((rate) => {
        if (this.currentRateSymbol === rate.symbol) {
          currentRateValue = rate.value;
        }
      });
      this.resultValue = (Number(this.userValue.trim()) * currentRateValue).toFixed(2);
    } 
  }

  newCurrentValue (e) {
    let rateSymbol = event.target.dataset.rate;
    this.template.querySelectorAll('.rate-item').forEach((item) => item.classList.remove('active'));
    e.toElement.classList.add('active')
    this.currentRateSymbol = rateSymbol;
    this.convertValues();
  }

  addToFavorites (e) {
    e.stopPropagation();
    let rateSymbol = event.target.dataset.rate;
    this.rates.forEach((rate) => {
      if (rate.symbol === rateSymbol) {
        if (rate.isFavorite === 'active') rate.isFavorite = '';
        else rate.isFavorite = 'active';
      }
    });
    this.refreshRates();
  }

  refreshRates() {
    this.rates = this.ratesArray
      .sort((a, b) => (a.isFavorite === b.isFavorite) ? 0 : a.isFavorite ? -1 : 1)
      .slice((this.page - 1) * this.max_number_on_page, this.page * this.max_number_on_page);
  }

  handleClick () {
    fetch('http://data.fixer.io/api/latest?access_key=e9e11290e4df160524a26dc509340e96')
    .then(response => response.json())
    .then(result => {
      this.rates = Object.keys(result.rates).map(function(key) {
        return {symbol: key, value: result.rates[key], isFavorite: ''
      }})
      this.ratesArray = this.rates;
      this.refreshRates();
    })
    .catch(error => console.log("error", error));
  }
}