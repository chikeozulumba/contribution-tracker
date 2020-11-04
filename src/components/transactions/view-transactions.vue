<template>
  <div class="w-full">
    <div class="flex flex-row justify-between w-full items-center">
      <h3 class="text-2xl font-primary">Transactions ({{ transactions.length }})</h3>
      <div>
        <a href="/" @click.prevent="generatePDF" class="bg-indigo-600 text-white rounded text-xs px-4 py-1 flex font-normal">
          Generate PDF
        </a>
      </div>
    </div>
    <div class="flex flex-col w-full mt-8">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">

          <div
            v-if="paginated.length > 0"
            class="border overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table id="transactions" class="max-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
                  >
                    Title & Memo
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
                  >
                    Transaction Date &<br/>Date Modified
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th v-if="!hideLastColumn" class="px-6 py-3 bg-gray-50" :class="[hideLastColumn ? 'hidden' : '']"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(transaction, i) in paginated" :key="i" :class="[i % 2 && 'bg-gray-50']">
                  <td class="px-6 py-4 md:whitespace-normal whitespace-no-wrap">
                    <div class="text-sm leading-5 text-gray-900 font-primary">
                      {{ transaction.payeeName }}
                    </div>
                    <div class="text-xs leading-5 text-gray-500 w-2/s3">
                      <p class="w-full">
                        {{ transaction.memo }}
                      </p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap flex flex-col font-secondary">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-secondary font-normal rounded-full bg-green-100 text-green-800"
                    >
                      {{ formatDate(transaction.transactionDate.seconds, "EEE PPpp") }}
                    </span>
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-secondary font-normal rounded-full bg-indigo-100 text-green-800 mt-2"
                    >
                      {{ formatDate(transaction.updatedAt.seconds, "EEE PPpp") }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-600 font-primary"
                  >
                    {{ moneyFormat(transaction.amount, transaction.currency || 'USD') }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium"
                    :class="[hideLastColumn ? 'hidden' : '']"
                    v-if="!hideLastColumn"
                  >
                    <span class="flex flex-col items-center">
                      <a href="#" class="text-indigo-600 hover:text-indigo-900 font-bold text-xs"
                        @click.prevent="() => modifyTransaction(transaction)"
                        >Modify</a
                      >
                      <a href="#" class="text-red-600 hover:text-indigo-900 font-bold text-xs mt-4"
                        @click.prevent="() => removeTransaction(transaction)"
                        >Delete</a
                      >
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="hidden">
            <nav class="relative z-0 inline-flex mt-4">
              <button :disabled="transactions.length === paginated.length" href="#" class="pl-4 relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" :class="[transactions.length === paginated.length && ' pr-4']" aria-label="Next" @click.prevent="() => $emit('more')">
                {{ transactions.length === paginated.length ? 'Finished' : 'Load more' }}
                <!-- Heroicon name: chevron-right -->
                <svg v-if="!(transactions.length === paginated.length)" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JSPDF from 'jspdf';
import 'jspdf-autotable';
import { mapState } from 'vuex';
import * as DateFNS from 'date-fns';

export default {
  props: ['paginated', 'prevBtnDisabled', 'nextBtnDisabled', 'paginatedFinished'],
  data() {
    return {
      data: [],
      hideLastColumn: false,
      form: {
        transactionDate: null,
        currencySymbol: '₦',
        currency: null,
        memo: null,
        payeeName: null,
      },
    };
  },
  methods: {
    generatePDF() {
      this.hideLastColumn = true;
      const doc = new JSPDF('p', 'pt');
      doc.autoTable({ html: '#transactions' });
      doc.save(`TRANSACTIONS-${new Date().getTime()}.pdf`);
    },
    handleCurrencyChange(evt) {
      const { value } = evt.target;
      if (typeof value === 'string') {
        const [currency, symbol] = value.split('-');
        this.form.currencySymbol = symbol;
        this.form.currency = currency;
      }
    },
    formatDate(date, format) {
      return DateFNS.format(new Date(date * 1000), format);
    },
    modifyTransaction(transaction) {
      this.$emit('modify', transaction);
    },
    removeTransaction(transaction) {
      this.$store.dispatch('removeTransaction', transaction.id);
    },
    moneyFormat(number, currency) {
      return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: currency?.toUpperCase() }).format(number);
    },
  },
  beforeMount() {
    this.$store.dispatch('getTransactions');
  },
  components: {},
  computed: {
    ...mapState({
      transactions: (state) => state.transactions,
    }),
  },
};
</script>

<style>
.notie-background-success {
    background-color: #5850ec !important;
}

.notie-background-warning {
    background-color: #ED8936 !important;
}

.notie-background-error {
    background-color: #E53E3E !important;
}

.notie-background-info {
    background-color: #2D3748 !important;
}

.notie-background-neutral {
    background-color: #E2E8F0 !important;
    color: #1A202C !important;
}

.notie-textbox-inner {
    font-size: 14px;
}

.notie-textbox-inner::first-letter {
    text-transform: capitalize;
}

.notie-textbox {
    color: #fff;
    padding: 10px 20px;
    position: fixed;
    width: 100%;
    text-align: center;
}
</style>
