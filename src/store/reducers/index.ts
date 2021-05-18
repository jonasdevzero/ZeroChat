import { combineReducers } from 'redux';

import call from './call'
import currentRoom from './currentRoom'
import user from './user'

export default combineReducers({ call, currentRoom, user });
