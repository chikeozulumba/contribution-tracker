import Vue from 'vue';
import Firebase from 'firebase';
import Vuex from 'vuex';
import * as firebase from '../utils/firebase';
import router from '../router';
import DataUtils from '../utils/data';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    transactions: [],
    paginated: [],
    userProfile: {},
  },
  mutations: {
    setUserProfile(state, data) {
      state.userProfile = data;
    },
    addNewTransaction(state, transaction) {
      state.transactions = [transaction, ...state.transactions];
    },
    setTransactions(state, transactions) {
      state.transactions = transactions;
    },
  },
  actions: {
    async checkIfAuthenticated({ commit }) {
      try {
        const userProfile = firebase.auth.currentUser.toJSON();
        return commit('setUserProfile', userProfile);
      } catch (error) {
        // dispatch('logout');
        return null;
      }
    },
    async addTransaction({ state }, transaction) {
      try {
        const payload = {
          ...transaction,
          transactionDate: new Date(transaction.transactionDate),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: state.userProfile.uid,
          id: DataUtils.uuidv4(),
        };
        await firebase.transactionCollection.add(payload);
        // commit('addNewTransaction', payload);
        return window.notie.alert({
          type: 'success',
          text: 'Transaction added successfully.',
          time: 5,
        });
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Adding transaction failed.',
          time: 3,
        });
        return null;
      }
    },
    async modifyTransaction(_, transaction) {
      try {
        const payload = {
          ...transaction,
          transactionDate: new Date(transaction.transactionDate),
          updatedAt: new Date(),
        };
        await firebase.transactionCollection.doc(payload.key).update(payload);
        return window.notie.alert({
          type: 'success',
          text: 'Transaction updated successfully.',
          time: 3,
        });
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Updating transaction failed.',
          time: 3,
        });
        return null;
      }
    },
    async removeTransaction(_, id) {
      try {
        if (id) {
          const [transaction] = await (await firebase.transactionCollection.where('id', '==', id).limit(1).get()).docs.map((docs) => ({ ...docs.data(), key: docs.id }));
          if (transaction) {
            await firebase.transactionCollection.doc(transaction.key).delete();
          }
          return window.notie.alert({
            type: 'success',
            text: 'Transaction removed successfully.',
            time: 3,
          });
        }
        return null;
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Removing transaction failed.',
          time: 3,
        });
        return null;
      }
    },
    async getTransactions({ state, commit }) {
      try {
        let transactions = await firebase.transactionCollection.where('userId', '==', state.userProfile.uid).orderBy('updatedAt', 'desc').get();
        transactions = transactions.docs.map((docs) => ({ ...docs.data(), key: docs.id }));
        return commit('setTransactions', transactions);
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Retrieving transactions failed.',
          time: 3,
        });
        return null;
      }
    },
    async login({ dispatch }) {
      try {
        const provider = new Firebase.auth.GoogleAuthProvider();
        const { user } = await firebase.auth.signInWithPopup(provider);
        return dispatch('fetchUserProfile', user.toJSON());
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Authentication failed.',
          time: 3,
        });
        return null;
      }
    },
    async logout() {
      try {
        await firebase.auth.signOut();
        window.location.reload();
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Can not logout at this time.',
          time: 3,
        });
      }
    },
    async fetchUserProfile({ commit }, user) {
      try {
        const userData = {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          lastLoginAt: user.lastLoginAt,
          dateJoined: new Date(),
          uid: user.uid,
        };
        let userProfile = await firebase.userCollection.where('uid', '==', user.uid).get();
        userProfile = userProfile.docs.map((docs) => docs.data());
        if (userProfile.length < 1) {
          await firebase.userCollection.add(userData);
        }
        commit('setUserProfile', userData);
        return router.push('/');
      } catch (error) {
        window.notie.alert({
          type: 'error',
          text: 'Failed to retrieve user data.',
          time: 5,
        });
        return null;
      }
    },
  },
  modules: {
  },
});
