import Immutable from 'immutable';
import chaiImmutable from 'chai-immutable';

import {
  COLLAPSE_PANEL,
  PREFS_LOADED,
  SET_KEYWORD_SEARCH_RECORD_TYPE,
  SET_KEYWORD_SEARCH_VOCABULARY,
  SET_SEARCH_PAGE_SIZE,
  SET_SEARCH_PANEL_PAGE_SIZE,
} from '../../../src/actions/prefs';

import reducer, {
  getKeywordSearchRecordType,
  getKeywordSearchVocabulary,
  getSearchPageSize,
  getSearchPanelPageSize,
  isPanelCollapsed,
} from '../../../src/reducers/prefs';

chai.use(chaiImmutable);
chai.should();

describe('prefs reducer', function suite() {
  it('should have empty immutable initial state', function test() {
    reducer(undefined, {}).should.equal(Immutable.Map({}));
  });

  it('should handle COLLAPSE_PANEL', function test() {
    const recordType = 'object';
    const panelName = 'desc';
    const collapsed = true;

    const state = reducer(undefined, {
      type: COLLAPSE_PANEL,
      payload: collapsed,
      meta: {
        recordType,
        name: panelName,
      },
    });

    state.should.deep.equal(Immutable.fromJS({
      panels: {
        object: {
          desc: {
            collapsed,
          },
        },
      },
    }));

    isPanelCollapsed(state, recordType, panelName).should.equal(collapsed);
  });

  it('should handle SET_KEYWORD_SEARCH_RECORD_TYPE', function test() {
    const recordType = 'loanin';

    const state = reducer(Immutable.Map(), {
      type: SET_KEYWORD_SEARCH_RECORD_TYPE,
      payload: recordType,
    });

    state.should.deep.equal(Immutable.fromJS({
      keywordSearch: {
        recordType,
      },
    }));

    getKeywordSearchRecordType(state).should.equal(recordType);
  });

  it('should delete vocabulary on SET_KEYWORD_SEARCH_RECORD_TYPE', function test() {
    const recordType = 'loanin';

    const state = reducer(Immutable.fromJS({
      keywordSearch: {
        recordType: 'person',
        vocabulary: 'local',
      },
    }), {
      type: SET_KEYWORD_SEARCH_RECORD_TYPE,
      payload: recordType,
    });

    state.should.deep.equal(Immutable.fromJS({
      keywordSearch: {
        recordType,
      },
    }));

    getKeywordSearchRecordType(state).should.equal(recordType);
  });

  it('should handle SET_KEYWORD_SEARCH_VOCABULARY', function test() {
    const vocabulary = 'ulan';

    const state = reducer(Immutable.Map(), {
      type: SET_KEYWORD_SEARCH_VOCABULARY,
      payload: vocabulary,
    });

    state.should.deep.equal(Immutable.fromJS({
      keywordSearch: {
        vocabulary,
      },
    }));

    getKeywordSearchVocabulary(state).should.equal(vocabulary);
  });

  it('should handle SET_SEARCH_PAGE_SIZE', function test() {
    const pageSize = 14;

    const state = reducer(undefined, {
      type: SET_SEARCH_PAGE_SIZE,
      payload: pageSize,
    });

    state.should.deep.equal(Immutable.fromJS({
      searchPageSize: pageSize,
    }));

    getSearchPageSize(state).should.equal(pageSize);
  });

  it('should handle SET_SEARCH_PANEL_PAGE_SIZE', function test() {
    const recordType = 'object';
    const panelName = 'desc';
    const pageSize = 35;

    const state = reducer(undefined, {
      type: SET_SEARCH_PANEL_PAGE_SIZE,
      payload: pageSize,
      meta: {
        recordType,
        name: panelName,
      },
    });

    state.should.deep.equal(Immutable.fromJS({
      panels: {
        object: {
          desc: {
            pageSize,
          },
        },
      },
    }));

    getSearchPanelPageSize(state, recordType, panelName).should.equal(pageSize);
  });

  it('should handle PREFS_LOADED', function test() {
    const prefs = Immutable.fromJS({
      panels: {
        object: {
          desc: {
            collapesed: true,
          },
        },
      },
    });

    const state = reducer(undefined, {
      type: PREFS_LOADED,
      payload: prefs,
    });

    state.should.deep.equal(prefs);
  });
});