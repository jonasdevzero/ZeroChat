import { combineReducers } from 'redux';

import call from './call'
import currentRoom from './currentRoom'

export default combineReducers({ call, currentRoom });
