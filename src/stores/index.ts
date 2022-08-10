import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { Router } from 'vue-router';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createQuasarCookiesPersistedState } from 'pinia-plugin-persistedstate/quasar';
import { Cookies } from 'quasar';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
enum TestCases {
  CreateStoreHelper = 'Helper',
  CreateStoreManual = 'Manual',
  CreateStoreSolution = 'Solution',
}

export const testCase: TestCases = TestCases.CreateStoreSolution;
export default store(({ ssrContext }) => {
  const pinia = createPinia();

  switch (testCase) {
    case TestCases.CreateStoreHelper as string:
      pinia.use(
        createQuasarCookiesPersistedState(Cookies, ssrContext, {
          cookiesOptions: { path: '/', sameSite: 'Lax', secure: true },
        })
      );
      break;
    case TestCases.CreateStoreManual as string:
      pinia.use(
        createPersistedState({
          storage: {
            getItem(key: string) {
              const cookies = process.env.SERVER
                ? Cookies.parseSSR(ssrContext)
                : Cookies;
              return JSON.stringify(cookies.get(key));
            },
            setItem(key: string, value: string) {
              const cookies = process.env.SERVER
                ? Cookies.parseSSR(ssrContext)
                : Cookies;
              cookies.set(key, JSON.parse(value), {
                path: '/',
                sameSite: 'Lax',
                secure: true,
              });
            },
          },
        })
      );
      break;
    case TestCases.CreateStoreSolution as string:
      const cookies = process.env.SERVER
        ? Cookies.parseSSR(ssrContext)
        : Cookies;
      pinia.use(
        createQuasarCookiesPersistedState(cookies, null, {
          cookiesOptions: { path: '/', sameSite: 'Lax', secure: true },
        })
      );
      break;
  }

  return pinia;
});
