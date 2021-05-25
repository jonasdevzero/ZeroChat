import { combineReducers } from 'redux'

import call from './call'
import room from './room'
import user from './user'
import screen from './screen'

export default combineReducers({
    call,
    room,
    user,
    screen
})
