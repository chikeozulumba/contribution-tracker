<template>
  <div class="w-full">
    <div class="mt-5 md:mt-0 md:col-span-2">
      <form @submit.prevent="createTransaction" method="POST">
        <div class="border border-gray-200 sm:rounded-md sm:overflow-hidden md:mb-0 mb-8">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="w-full flex flex-col">
              <h3 class="text-lg font-primary">{{ mode === 'add' ? 'Add' : 'Modify' }} Transaction</h3>
              <div class="block mt-4">
                <label
                  for="payeeName"
                  class="block text-sm font-medium leading-5 text-gray-700 font-medium"
                >
                  Payee name <span class="text-red-700 font-bold text-xs"> *</span>
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input
                    id="payeeName"
                    class="form-input flex-1 block w-full rounded-none rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    placeholder="John doe"
                    v-model="form.payeeName"
                  />
                </div>
              </div>

              <div class="mt-6">
                <label
                  for="amount"
                  class="block text-sm leading-5 font-medium text-gray-700"
                  >Amount <span class="text-red-700 font-bold text-xs"> *</span></label
                >
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <span class="text-gray-500 sm:text-sm sm:leading-5">
                      {{ form.currencySymbol }}
                    </span>
                  </div>
                  <input
                    id="amount"
                    class="form-input block w-full pl-8 pr-12 sm:text-sm sm:leading-5"
                    placeholder="0.00"
                    v-model="form.amount"
                    type="number"
                    pattern="^\d*(\.\d{0,2})?$"
                    step="any"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center">
                    <select
                      @change.prevent="handleCurrencyChange"
                      aria-label="Currency"
                      class="form-select h-full py-0 pl-2 pr-8 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5 focus:outline-none"
                    >
                      <option value="ngn-₦" selected>NGN</option>
                      <option value="usd-$">USD</option>
                      <option value="cad-$">CAD</option>
                      <option value="eur-€">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <label
                  for="amount"
                  class="block text-sm leading-5 font-medium text-gray-700 mb-1"
                  >Transaction Date <span class="text-red-700 font-bold text-xs"> *</span></label
                >
                <v-date-picker v-model="form.transactionDate" mode="dateTime" is24hr>
                  <template v-slot="{ inputValue, inputEvents }">
                    <input
                      class="form-input flex-1 block w-full rounded-none rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      :value="inputValue"
                      v-on="inputEvents"
                      placeholder="Choose transaction date"
                    />
                  </template>
                </v-date-picker>
              </div>
            </div>

            <div class="mt-6">
              <label
                for="memo"
                class="block text-sm leading-5 font-medium text-gray-700"
              >
                Memo <span class="text-red-700 font-bold text-xs"> *</span>
              </label>
              <div class="rounded-md shadow-sm">
                <textarea
                  id="memo"
                  rows="2"
                  class="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none"
                  placeholder="Enter Memo (Max. 100 words)"
                  v-model="form.memo"
                  maxlength="100"
                ></textarea>
              </div>
              <p class="mt-4 text-xs text-gray-500">
                All links marked <span class="text-red-700 font-bold text-xs"> *</span> are important.
              </p>
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <span class="inline-flex items-center">
              <a @click="resetForm" href="#" class="text-gray-500 hover:text-gray-700 font-bold text-sm mr-4"
                >{{mode === 'add' ? 'Reset' : 'Cancel' }}</a
              >
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                {{mode === 'add' ? 'Add' : 'Update' }}
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mode', 'transaction'],
  data() {
    return {
      data: [],
      form: {
        transactionDate: null,
        currencySymbol: '₦',
        currency: 'ngn',
        memo: null,
        payeeName: null,
        amount: null,
      },
    };
  },
  watch: {
    transaction(data) {
      if (this.mode === 'modify') {
        this.form = { ...data };
      }
    },
  },
  mounted() {
  },
  methods: {
    handleCurrencyChange(evt) {
      const { value } = evt.target;
      if (typeof value === 'string') {
        const [currency, symbol] = value.split('-');
        this.form.currencySymbol = symbol;
        this.form.currency = currency;
      }
    },
    async createTransaction() {
      const errors = [];
      Object.entries(this.form).forEach(([key, val]) => {
        if (!val || val?.length < 1) {
          errors.push(key);
        }
      });

      if (errors.length !== 0) {
        return window.notie.alert({
          type: 'error',
          text: `Validation failed - ${errors.length} field(s) are invalid.`,
          time: 3,
        });
      }

      if (this.mode === 'add') {
        await this.$store.dispatch('addTransaction', this.form);
        this.$emit('refresh');
        setTimeout(() => this.resetForm(), 1800);
      }

      if (this.mode === 'modify') {
        await this.$store.dispatch('modifyTransaction', this.form);
        this.$emit('refresh');
        this.resetForm();
      }
      return true;
    },
    resetForm() {
      this.form = {
        transactionDate: null,
        currencySymbol: '₦',
        currency: 'ngn',
        memo: null,
        payeeName: null,
        amount: null,
      };
      if (this.mode === 'modify') {
        this.$emit('cancelModify');
      }
    },
  },
  components: {
  },
};
</script>

<style scoped>
#memo {
  resize: none;
}
.form-select:focus {
  border-color: transparent;
}
.focus\:outline-none:focus {
    outline: none;
    outline-offset: 0px;
}
.form-select:focus {
  box-shadow: none;
}
</style>
