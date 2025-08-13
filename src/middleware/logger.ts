// import type { Middleware, MiddlewareAPI, Dispatch } from 'redux'
// import type { RootState } from '../store' // Adjust path

// export const logger: Middleware<{}, RootState> = (storeAPI: MiddlewareAPI) => (next: Dispatch) => (action) => {
//   console.log('State before:', storeAPI.getState())
//   console.log('Dispatching:', action)
//   const result = next(action)
//   console.log('State after:', storeAPI.getState())
//   return result
// }
