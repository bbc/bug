import instancesReducer from './redux/instancesSlice'
// import filtersReducer from './redux/filtersSlice'

export default function rootReducer(state = {}, action) {

  return {
    instances: instancesReducer(state.instances, action),
    // filters: filtersReducer(state.filters, action)
  }
}