import Immutable from 'immutable';

import {
  SET_KEYWORD_SEARCH_KEYWORD,
} from '../actions/keywordSearch';

export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case SET_KEYWORD_SEARCH_KEYWORD:
      return state.set('keyword', action.payload);
    default:
      return state;
  }
};

export function getKeyword(state) {
  return state.get('keyword');
}