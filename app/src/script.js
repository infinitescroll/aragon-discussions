import '@babel/polyfill'
import { of } from 'rxjs'
import AragonApi from '@aragon/api'

import { updateState, initialState } from './state'

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const api = new AragonApi()

api.store(
  async (state, event) => {
    let newState
    switch (event.event) {
      case INITIALIZATION_TRIGGER:
        newState = { ...initialState, syncing: false }
        break
      case 'Post':
        newState = await updateState('Post', state, event)
        break
      default:
        newState = state
    }
    return newState
  },
  [
    // Always initialize the store with our own home-made event
    of({ event: INITIALIZATION_TRIGGER }),
  ]
)
