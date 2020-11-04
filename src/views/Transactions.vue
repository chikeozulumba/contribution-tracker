<template>
  <div class="about flex flex-col md:flex-row max-w-8xl px-2 mx-auto pb-8">
    <div class="md:w-1/3 md:mr-4 w-full">
      <TransactionsInput
        @cancelModify="cancelModify"
        :mode="mode"
        :transaction="transaction"
      />
    </div>
    <div class="md:w-2/3 w-full">
      <ViewTransactions
        :paginated="transactions"
        v-on:modify="modifyTransaction"
        v-on:prev="prev"
        v-on:next="next"
        v-on:more="loadMore"
        :prevBtnDisabled="prevBtnDisabled"
        :nextBtnDisabled="nextBtnDisabled"
        :paginatedFinished="paginatedFinished"
        :refresh="fetchData"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as firebase from '@/utils/firebase';
import TransactionsInput from '@/components/transactions/input.vue';
import ViewTransactions from '@/components/transactions/view-transactions.vue';

export default {
  name: 'App',
  computed: {
    ...mapState({
      user: (state) => state.userProfile,
      transactions: (state) => state.transactions,
    }),
  },
  data() {
    return {
      data: [],
      firstFetched: 0,
      prevBtnDisabled: true,
      nextBtnDisabled: false,
      lastDoc: null,
      mode: 'add',
      transaction: null,
      limit: 5,
      startAt: null,
      paginatedFinished: false,
      paginateMode: null,
      queryParam: 'updatedAt',
      sortOrder: 'desc',
    };
  },
  async mounted() {
    if (this.user.uid) {
      await this.fetchData();
    }
  },
  methods: {
    async prev() {
      this.paginateMode = 'prev';
      await this.fetchData();
    },
    async next() {
      this.paginateMode = 'next';
      await this.fetchData();
    },
    async loadMore() {
      try {
        if (!this.lastDoc) {
          window.notie.alert({
            type: 'success',
            text: 'Transaction records exhausted.',
            time: 3,
          });
          return;
        }

        let documents = await firebase.transactionCollection
          .where('userId', '==', this.user.uid)
          .orderBy(this.queryParam, this.sortOrder)
          .limit(this.limit)
          .startAfter(this.lastDoc)
          .get();
        this.lastDoc = documents.docs[documents.docs.length - 1];
        documents = documents.docs.map((docs) => ({
          ...docs.data(),
          key: docs.id,
        }));
        if (documents.length === 0) {
          window.notie.alert({
            type: 'success',
            text: 'Transaction added successfully.',
            time: 3,
          });
        } else this.data.push(...documents);
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Failed to load transactions records',
          time: 3,
        });
      }
    },
    async fetchData() {
      try {
        let documents = await firebase.transactionCollection
          .where('userId', '==', this.user.uid)
          .orderBy(this.queryParam, this.sortOrder)
          .limit(this.limit)
          .get();

        this.lastDoc = documents.docs[documents.docs.length - 1];
        documents = documents.docs.map((docs) => ({
          ...docs.data(),
          key: docs.id,
        }));
        this.data = documents;
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Failed to load transactions records',
          time: 3,
        });
      }
    },
    cancelModify() {
      this.mode = 'add';
    },
    modifyTransaction(data) {
      if (data?.id) {
        this.mode = 'modify';
        this.transaction = {
          ...data,
          transactionDate: new Date(data.transactionDate.seconds * 1000),
        };
      }
    },
  },
  components: {
    TransactionsInput,
    ViewTransactions,
  },
};
</script>
