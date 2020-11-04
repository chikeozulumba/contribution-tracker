/* eslint-disable no-restricted-syntax */
<template>
  <div class="home max-w-7xl px-2 mx-auto">
    <h3 class="text-2xl font-primary mb-2">About</h3>
    <h3 class="text-xl font-primary">{{ user.displayName }}</h3>
    <h3 class="text-md">{{ user.email }}</h3>
    <ul class="flex flex-col mt-8">
      <li class="my-2 inline-flex items-end cursor-pointer text-gray-800 hover:text-purple-700">
        <span class="mr-4">
          <svg
            class="h-8 w-8 fill-current"
            height="512"
            viewBox="0 0 24 24"
            width="512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z"
            />
          </svg>
        </span>
        <a
          class="border-b-4 border-purple-700"
          href="https://github.com/chikeozulumba"
          target="_blank"
        >
          Github account
        </a>
      </li>
      <li class="my-2 inline-flex items-end cursor-pointer text-gray-800 hover:text-purple-700">
        <span class="mr-4">
          <svg
            class="h-8 w-8 fill-current"
            height="908"
            viewBox="-21 -81 681.33464 681"
            width="908"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M200.964844 515.292969c241.050781 0 372.871094-199.703125 372.871094-372.871094 0-5.671875-.117188-11.320313-.371094-16.9375 25.585937-18.5 47.824218-41.585937 65.371094-67.863281-23.480469 10.441406-48.753907 17.460937-75.257813 20.636718 27.054687-16.230468 47.828125-41.894531 57.625-72.488281-25.320313 15.011719-53.363281 25.917969-83.214844 31.808594-23.914062-25.472656-57.964843-41.402344-95.664062-41.402344-72.367188 0-131.058594 58.6875-131.058594 131.03125 0 10.289063 1.152344 20.289063 3.398437 29.882813-108.917968-5.480469-205.503906-57.625-270.132812-136.921875-11.25 19.363281-17.742188 41.863281-17.742188 65.871093 0 45.460938 23.136719 85.605469 58.316407 109.082032-21.5-.660156-41.695313-6.5625-59.351563-16.386719-.019531.550781-.019531 1.085937-.019531 1.671875 0 63.46875 45.171875 116.460938 105.144531 128.46875-11.015625 2.996094-22.605468 4.609375-34.558594 4.609375-8.429687 0-16.648437-.828125-24.632812-2.363281 16.683594 52.070312 65.066406 89.960937 122.425781 91.023437-44.855469 35.15625-101.359375 56.097657-162.769531 56.097657-10.5625 0-21.003906-.605469-31.2617188-1.816407C58.082031 493.601562 126.953125 515.296875 200.96875 515.296875"
            />
          </svg>
        </span>
        <a
          class="border-b-4 border-purple-700"
          href="https://twitter.com/chikeozulumba"
          target="_blank"
        >
          Twitter account
        </a>
      </li>
      <li class="my-2 inline-flex items-end cursor-pointer text-gray-800 hover:text-purple-700">
        <span class="mr-4">
          <svg
            class="h-8 w-8 fill-current"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M437 0H75C33.648438 0 0 33.648438 0 75v362c0 41.351562 33.648438 75 75 75h362c41.351562 0 75-33.648438 75-75V75c0-41.351562-33.648438-75-75-75zM181 406h-60V196h60zm0-240h-60v-60h60zm210 240h-60V286c0-16.539062-13.460938-30-30-30s-30 13.460938-30 30v120h-60V196h60v11.308594C286.71875 202.421875 296.929688 196 316 196c40.691406.042969 75 36.546875 75 79.6875zm0 0"
            />
          </svg>
        </span>
        <a
          class="border-b-4 border-purple-700"
          href="hhttps://www.linkedin.com/in/chike-ozulumba-360626b1/"
          target="_blank"
        >
          LinkedIn account
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  data() {
    return {
      years: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.userProfile,
    }),
  },
  mounted() {
    console.log(this.user);
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
