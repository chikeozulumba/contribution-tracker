/* eslint-disable no-restricted-syntax */
<template>
  <div class="home max-w-7xl px-2 mx-auto">
    <h3 class="text-2xl font-primary mb-8">Dashboard</h3>
    <div class="flex flex-col flex w-full" v-if="transactions.length > 0">
      <div class="md:mb-0 mb-8 w-full flex flex-col md:flex-row">
        <div
          class="border border-gray-200 sm:rounded-md sm:overflow-hidden px-4 py-5 bg-white sm:p-6 md:w-1/2 w-full mt-4 md:mt-0 md:mr-2"
        >
          <h3 class="text-md font-primary mb-8 text-gray-500">
            Contributions by month for 2020
          </h3>
          <canvas id="1stChart" width="400" height="400"></canvas>
        </div>
        <div
          class="border border-gray-200 sm:rounded-md sm:overflow-hidden px-4 py-5 bg-white sm:p-6 md:w-1/2 w-full mt-4 md:mt-0 md:ml-2"
        >
          <h3 class="text-md font-primary mb-8 text-gray-500">
            Total contributions by year
          </h3>
          <canvas id="2ndChart" width="400" height="400"></canvas>
        </div>
      </div>
      <div class="md:mt-4 mb-8 w-full flex flex-col md:flex-row">
        <div
          class="border border-gray-200 sm:rounded-md sm:overflow-hidden px-4 py-5 bg-white sm:p-6 md:w-1/2 w-full mt-4 md:mt-0 md:mr-2"
        >
          <div class="flex flex-row justify-between items-center mb-8">
            <h3 class="text-md font-primary text-gray-500">
              Contribution increase/decrease by year
            </h3>
            <div class="text-gray-600 font-bold text-sm">
              <span class="text-gray-500">Year: </span
              ><select @change="developChartThree" class="bg-transparent focus:outline-none uppercase">
                <option v-for="(year, i) in years" :key="i">{{ year }}</option>
              </select>
            </div>
          </div>
          <canvas id="3rdChart" width="400" height="400"></canvas>
        </div>
        <div
          class="border border-gray-200 sm:rounded-md sm:overflow-hidden px-4 py-5 bg-white sm:p-6 md:w-1/2 w-full mt-4 md:mt-0 md:ml-2"
        >
          <div class="flex flex-col items-left">
            <h3 class="text-md font-primary text-gray-500">
              Average contribution amount
            </h3>
            <div class="flex flex-row justify-between">
              <div class="flex">
                <div class="text-gray-600 font-bold text-sm mr-4">
                  <label class="flex items-center">
                    <span class="mr-2">Year</span>
                    <input type="radio" data-type="year" :checked="chosenModeChartFour === 'year'" @change="chosenYearChartFourMethod" name="type" />
                  </label>
                </div>
                <div class="text-gray-600 font-bold text-sm mr-4">
                  <label class="flex items-center">
                    <span class="mr-2">Month</span>
                    <input type="radio" data-type="month" :checked="chosenModeChartFour === 'month'" @change="chosenYearChartFourMethod" name="type" />
                  </label>
                </div>
              </div>
              <div v-if="chosenModeChartFour === 'month'" class="text-gray-600 font-bold text-sm">
                <span class="text-gray-500">Amount in: </span
                ><select @change.prevent="handleChartFourCurrencyChange" class="bg-transparent focus:outline-none uppercase">
                  <option v-for="(currency, i) in Object.keys(exchangeRate)" :key="i" :value="currency">{{ currency }}</option>
                </select>
              </div>
            </div>
          </div>
          <canvas id="4thChart" width="400" height="400"></canvas>
        </div>
      </div>
    </div>
    <p v-else>No transaction data available.</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getYear, getMonth } from 'date-fns';
import { borderColor, backgroundColor } from '../utils/colors';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default {
  name: 'Dashboard',
  data() {
    return {
      years: [],
      chosenYear: null,
      selectedCurrency: 'ngn',
      chosenModeChartFour: 'year',
      fourthChart: null,
      exchangeRate: {
        ngn: {
          usd: 381.5,
          eur: 447.99,
          cad: 286.56,
        },
        usd: {
          ngn: 0.0026,
          eur: 1.17,
          cad: 0.75,
        },
        eur: {
          usd: 0.85,
          ngn: 0.0022,
          cad: 0.64,
        },
        cad: {
          usd: 1.33,
          eur: 1.56,
          ngn: 0.0035,
        },
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.userProfile,
      transactions: (state) => state.transactions,
      state: (state) => state,
    }),
  },
  mounted() {
    if (this.user.uid) {
      this.$store.dispatch('getTransactions');
    }
  },
  updated() {
    this.developChartOne();
    this.developChartTwo();

    if (this.years.length === 0) {
      this.years = this.populateYearsAvailable().reverse();
      [this.chosenYear] = this.years;
      this.developChartThree();
      this.developChartFour();
      this.chartGroupByYearForAmount();
    }
  },
  methods: {
    handleChartFourCurrencyChange(e) {
      this.selectedCurrency = e.target.value;
      this.developChartFour();
    },
    chosenYearChartFourMethod(e) {
      this.chosenModeChartFour = e.target.dataset.type;
      this.developChartFour();
    },
    changeYearForChartThree(e) {
      this.chosenYear = e.target.value;
    },
    generateMonthsMap() {
      const months = {};
      MONTHS.forEach((m) => {
        months[m] = 0;
      });
      return months;
    },
    chartFourGenerateMonthsMap() {
      const months = {};
      MONTHS.forEach((m) => {
        months[m] = [0];
      });
      return months;
    },
    populateYearsAvailable() {
      const years = [];
      this.transactions
        .forEach(
          (transaction) => {
            const year = getYear(new Date(transaction.transactionDate.seconds * 1000));
            if (!years.includes(year)) {
              years.push(year);
            }
          },
        );

      return years.sort();
    },
    chartGroupByMonth(year = 2020) {
      let data = {};
      this.transactions
        .filter(
          (transaction) => getYear(new Date(transaction.transactionDate.seconds * 1000)) === year,
        )
        .forEach((transaction) => {
          const date = new Date(transaction.transactionDate.seconds * 1000);
          const month = MONTHS[date.getMonth()];
          if (typeof data[month] === 'number') {
            data[month] += 1;
          } else {
            data[month] = 1;
          }
        });
      data = Object.keys(data)
        // .sort()
        .reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});
      return [Object.keys(data), Object.values(data)];
    },
    chartGroupByYear() {
      let data = {};
      this.transactions.forEach((transaction) => {
        const year = getYear(new Date(transaction.transactionDate.seconds * 1000));
        if (typeof data[year] === 'number') {
          data[year] += 1;
        } else {
          data[year] = 1;
        }
      });
      data = Object.keys(data)
        .sort()
        .reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});
      return [Object.keys(data), Object.values(data)];
    },
    calculateBycurrency(transaction) {
      const exchangeRate = this.exchangeRate[this.selectedCurrency];
      const rate = exchangeRate[transaction.currency];
      const amount = parseFloat(transaction.amount);
      if (rate) return amount * rate;
      return amount;
    },
    chartGroupByYearForAmount() {
      let data = {};
      this.transactions.forEach((transaction) => {
        const year = getYear(new Date(transaction.transactionDate.seconds * 1000));
        if (Array.isArray(data[year])) {
          data[year].push(this.calculateBycurrency(transaction));
        } else {
          data[year] = [this.calculateBycurrency(transaction)];
        }
      });
      data = Object.keys(data)
        .sort()
        .reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});

      return [Object.keys(data), Object.values(data).map((val) => val.reduce((t, n) => (t + n) / val.length))];
    },
    chartGroupByMonthsForAmount() {
      let data = this.chartFourGenerateMonthsMap(true);
      this.transactions.forEach((transaction) => {
        const date = new Date(transaction.transactionDate.seconds * 1000);
        const month = MONTHS[date.getMonth()];
        if (Array.isArray(data[month])) {
          data[month].push(this.calculateBycurrency(transaction));
        } else {
          data[month] = [this.calculateBycurrency(transaction)];
        }
      });
      data = Object.keys(data)
        .reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});
      return [Object.keys(data), Object.values(data).map((val) => val.reduce((t, n) => (t + n) / val.length))];
    },
    developChartOne() {
      const [labels, data] = this.chartGroupByMonth();
      const ctx = document.getElementById('1stChart').getContext('2d');
      // eslint-disable-next-line no-new
      new window.ChartJS(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              label: '# of Transactions',
              data,
              borderColor,
              backgroundColor,
              borderWidth: 1,
            },
          ],
        },
        // options,
      });
    },
    developChartTwo() {
      const [labels, data] = this.chartGroupByYear();
      const ctx = document.getElementById('2ndChart').getContext('2d');
      // eslint-disable-next-line no-new
      new window.ChartJS(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'No. of Transactions',
              data,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderWidth: 1,
            },
          ],
        },
      });
    },
    chartGroupIncreaseDecrease(yearParam) {
      let chosenYear = yearParam;
      if (!chosenYear) {
        [chosenYear] = this.years;
      }
      const years = {};
      this.transactions.forEach((transaction) => {
        const year = getYear(new Date(transaction.transactionDate.seconds * 1000));
        if (Array.isArray(years[year])) {
          years[year].push(transaction);
        } else {
          years[year] = [transaction];
        }
      });

      const transactions = years[chosenYear];
      const monthsCollection = this.generateMonthsMap();

      if (!Array.isArray(transactions)) return null;
      transactions.forEach((transaction) => {
        const month = getMonth(new Date(transaction.transactionDate.seconds * 1000));
        monthsCollection[MONTHS[month]] += 1;
      });

      return [Object.keys(monthsCollection), Object.values(monthsCollection)];
    },
    developChartThree(e) {
      const year = e?.target?.value || this.chosenYear;
      const [labels, data] = this.chartGroupIncreaseDecrease(year);
      const ctx = document.getElementById('3rdChart').getContext('2d');
      // eslint-disable-next-line no-new
      new window.ChartJS(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Donations by months',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.9)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        // options,
      });
    },
    chartAverageMonthAndYear() {
      let data = null;
      if (this.chosenModeChartFour === 'year') {
        data = this.chartGroupByYearForAmount();
      } else {
        data = this.chartGroupByMonthsForAmount();
      }

      return data;
    },
    developChartFour() {
      const dataSets = this.chartAverageMonthAndYear();
      if (!Array.isArray(dataSets)) return;
      const [labels, data] = dataSets;
      if (this.fourthChart) this.fourthChart.destroy();
      // eslint-disable-next-line no-new
      this.fourthChart = new window.ChartJS(
        document.getElementById('4thChart').getContext('2d'),
        {
          type: `${this.chosenModeChartFour === 'year' ? 'pie' : 'line'}`,
          data: {
            labels,
            datasets: [
              {
                label: `Average donations in ${this.chosenModeChartFour === 'year' ? 'Years' : 'Months'}`,
                data,
                backgroundColor: this.chosenModeChartFour === 'year' ? backgroundColor : 'rgba(153, 102, 255, 0.5)',
                borderColor: this.chosenModeChartFour === 'year' ? borderColor : 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: (this.chosenModeChartFour === 'month' && {
            scales: {
              yAxes: [{
                ticks: {
                  // beginAtZero: true,
                  callback: (value) => (new Intl.NumberFormat('ja-JP', { style: 'currency', currency: this.selectedCurrency?.toUpperCase() }).format(value)),
                },
              }],
            },
          }),
        },
      );
    },
  },
  components: {},
};
</script>

<style>
.ct-label {
  font-size: 1.2rem;
  font-weight: 500;
  color: wheat !important;
}
</style>
