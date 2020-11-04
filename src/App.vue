<template>
  <div>
    <Navbar v-if="user.uid" />
    <div class="p-4 bg-gray-100 min-h-screen pb-8">
      <router-view />
    </div>
    <footer v-if="user.uid" class="fixed bottom-0 left-0 p-4 bg-gray-800 w-full flex">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <router-link class="text-gray-300 px-3 py-2 rounded-md text-sm font-medium leading-5 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out" to="/about">About</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Navbar from '@/components/Navbar.vue';
import * as firebase from '@/utils/firebase';

export default {
  name: 'App',
  computed: {
    ...mapState({
      user: (state) => state.userProfile,
    }),
  },
  mounted() {
    this.$store.dispatch('checkIfAuthenticated');
    if (this.user.uid) {
      firebase.transactionCollection.where('userId', '==', this.user.uid).orderBy('updatedAt', 'desc').onSnapshot((snapshot) => {
        const transactions = snapshot.docs.map((docs) => ({ ...docs.data(), key: docs.id }));
        this.$store.commit('setTransactions', transactions);
      });
    }
  },
  components: {
    Navbar,
  },
};
</script>
