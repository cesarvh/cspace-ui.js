import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import Immutable from 'immutable';

import {
  CLEAR_SEARCH_RESULTS,
  CLEAR_SELECTED,
  CREATE_EMPTY_SEARCH_RESULT,
  DESELECT_RESULT_ITEM,
  SET_MOST_RECENT_SEARCH,
  SET_RESULT_ITEM_SELECTED,
  SEARCH_STARTED,
  SEARCH_FULFILLED,
  SEARCH_REJECTED,
  SET_ALL_RESULT_ITEMS_SELECTED,
} from '../../../src/constants/actionCodes';

import {
  configureCSpace,
} from '../../../src/actions/cspace';

import {
  clearSelected,
  clearSearchResults,
  deselectResultItem,
  search,
  setResultItemSelected,
  setAllResultItemsSelected,
} from '../../../src/actions/search';

import {
  ERR_INVALID_SORT,
  ERR_UNKNOWN_RECORD_TYPE,
  ERR_UNKNOWN_VOCABULARY,
} from '../../../src/constants/errorCodes';

import {
  searchKey,
} from '../../../src/reducers/search';

chai.should();

const mockStore = configureMockStore([thunk]);

describe('search action creator', function suite() {
  describe('search', function actionSuite() {
    const recordType = 'person';
    const servicePath = 'personauthorities';
    const vocabulary = 'local';
    const vocabularyServicePath = 'urn:cspace:name(person)';
    const termsServicePath = 'authorityrefs';
    const searchUrl = new RegExp(`^/cspace-services/${servicePath}/${vocabularyServicePath.replace('(', '\\(').replace(')', '\\)')}/items.*`);

    const listTypes = {
      common: {
        listNodeName: 'ns2:abstract-common-list',
        itemNodeName: 'list-item',
      },
    };

    const config = {
      listTypes,
      recordTypes: {
        [recordType]: {
          serviceConfig: {
            servicePath,
          },
          vocabularies: {
            [vocabulary]: {
              serviceConfig: {
                servicePath: vocabularyServicePath,
              },
            },
          },
          columns: {
            default: {
              updatedAt: {
                sortBy: 'collectionspace_core:updatedAt',
              },
            },
          },
        },
      },
      subresources: {
        terms: {
          serviceConfig: {
            servicePath: termsServicePath,
          },
        },
      },
    };

    const searchQuery = {
      kw: 'abcd',
      p: 0,
    };

    const searchName = 'testSearch';

    const searchDescriptor = Immutable.fromJS({
      recordType,
      vocabulary,
      searchQuery,
    });

    before(() => {
      const store = mockStore({
        user: Immutable.Map(),
      });

      return store.dispatch(configureCSpace());
    });

    beforeEach(() => {
      moxios.install();
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should dispatch SEARCH_FULFILLED on success', function test() {
      moxios.stubRequest(searchUrl, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        search: Immutable.Map(),
      });

      return store.dispatch(search(config, searchName, searchDescriptor))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(2);

          actions[0].should.deep.equal({
            type: SEARCH_STARTED,
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor,
            },
          });

          actions[1].should.deep.equal({
            type: SEARCH_FULFILLED,
            payload: {
              status: 200,
              statusText: undefined,
              headers: undefined,
              data: {},
            },
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor,
            },
          });
        });
    });

    it('should dispatch SET_MOST_RECENT_SEARCH when a search with a given descriptor is already pending', function test() {
      moxios.stubRequest(searchUrl, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        search: Immutable.fromJS({
          [searchName]: {
            byKey: {
              [searchKey(searchDescriptor)]: {
                isPending: true,
              },
            },
          },
        }),
      });

      store.dispatch(search(config, searchName, searchDescriptor));

      const actions = store.getActions();

      actions.should.have.lengthOf(1);

      actions[0].should.deep.equal({
        type: SET_MOST_RECENT_SEARCH,
        meta: {
          searchName,
          searchDescriptor,
        },
      });
    });

    it('should dispatch SET_MOST_RECENT_SEARCH when a search with a given descriptor already has a result', function test() {
      moxios.stubRequest(searchUrl, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        search: Immutable.fromJS({
          [searchName]: {
            byKey: {
              [searchKey(searchDescriptor)]: {
                result: {},
              },
            },
          },
        }),
      });

      store.dispatch(search(config, searchName, searchDescriptor));

      const actions = store.getActions();

      actions.should.have.lengthOf(1);

      actions[0].should.deep.equal({
        type: SET_MOST_RECENT_SEARCH,
        meta: {
          searchName,
          searchDescriptor,
        },
      });
    });

    it('should dispatch CREATE_EMPTY_SEARCH_RESULT on a related record query with empty csid', function test() {
      const relSearchDescriptor = Immutable.fromJS({
        recordType,
        vocabulary,
        searchQuery: {
          rel: '',
        },
      });

      const store = mockStore({
        search: Immutable.fromJS({
          [searchName]: {
            byKey: {},
          },
        }),
      });

      store.dispatch(search(config, searchName, relSearchDescriptor));

      const actions = store.getActions();

      actions.should.have.lengthOf(2);

      actions[0].should.deep.equal({
        type: SEARCH_STARTED,
        meta: {
          listTypeConfig: listTypes.common,
          searchName,
          searchDescriptor: relSearchDescriptor,
        },
      });

      actions[1].should.deep.equal({
        type: CREATE_EMPTY_SEARCH_RESULT,
        meta: {
          listTypeConfig: listTypes.common,
          searchName,
          searchDescriptor: relSearchDescriptor,
        },
      });
    });

    it('should accept null/undefined vocabulary name', function test() {
      const noVocabularySearchUrl = new RegExp(`^/cspace-services/${servicePath}.*`);

      moxios.stubRequest(noVocabularySearchUrl, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        search: Immutable.Map(),
      });

      const noVocabularySearchDescriptor = Immutable.fromJS({
        recordType,
        searchQuery,
      });

      return store.dispatch(search(config, searchName, noVocabularySearchDescriptor))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(2);

          actions[0].should.deep.equal({
            type: SEARCH_STARTED,
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: noVocabularySearchDescriptor,
            },
          });

          actions[1].should.deep.equal({
            type: SEARCH_FULFILLED,
            payload: {
              status: 200,
              statusText: undefined,
              headers: undefined,
              data: {},
            },
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: noVocabularySearchDescriptor,
            },
          });
        });
    });

    it('should accept searches for subresources', function test() {
      const csid = '1234';
      const subresource = 'terms';
      const subresourceSearchUrl = new RegExp(`^/cspace-services/${servicePath}/${vocabularyServicePath.replace('(', '\\(').replace(')', '\\)')}/items/${csid}/${termsServicePath}.*`);

      moxios.stubRequest(subresourceSearchUrl, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        search: Immutable.Map(),
      });

      const subresourceSearchQuery = {
        p: 0,
        size: 10,
      };

      const subresourceSearchDescriptor = Immutable.fromJS({
        recordType,
        vocabulary,
        csid,
        subresource,
        searchQuery: subresourceSearchQuery,
      });

      return store.dispatch(search(config, searchName, subresourceSearchDescriptor))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(2);

          actions[0].should.deep.equal({
            type: SEARCH_STARTED,
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: subresourceSearchDescriptor,
            },
          });

          actions[1].should.deep.equal({
            type: SEARCH_FULFILLED,
            payload: {
              status: 200,
              statusText: undefined,
              headers: undefined,
              data: {},
            },
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: subresourceSearchDescriptor,
            },
          });
        });
    });

    it('should generate the sort parameter', function test() {
      const sortedSearchUrl = new RegExp('\\?.*sortBy=collectionspace_core:updatedAt');

      moxios.stubRequest(sortedSearchUrl, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        search: Immutable.Map(),
      });

      const sortedSearchDescriptor = Immutable.fromJS({
        recordType,
        searchQuery: Object.assign({}, searchQuery, {
          sort: 'updatedAt',
        }),
      });

      return store.dispatch(search(config, searchName, sortedSearchDescriptor))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(2);

          actions[0].should.deep.equal({
            type: SEARCH_STARTED,
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: sortedSearchDescriptor,
            },
          });

          actions[1].should.deep.equal({
            type: SEARCH_FULFILLED,
            payload: {
              status: 200,
              statusText: undefined,
              headers: undefined,
              data: {},
            },
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: sortedSearchDescriptor,
            },
          });
        });
    });

    it('should generate the sort parameter for descending searches', function test() {
      const sortedSearchUrl = new RegExp('\\?.*sortBy=collectionspace_core:updatedAt\\+DESC');

      moxios.stubRequest(sortedSearchUrl, {
        status: 200,
        response: {},
      });

      const store = mockStore({
        search: Immutable.Map(),
      });

      const sortedSearchDescriptor = Immutable.fromJS({
        recordType,
        searchQuery: Object.assign({}, searchQuery, {
          sort: 'updatedAt desc',
        }),
      });

      return store.dispatch(search(config, searchName, sortedSearchDescriptor))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(2);

          actions[0].should.deep.equal({
            type: SEARCH_STARTED,
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: sortedSearchDescriptor,
            },
          });

          actions[1].should.deep.equal({
            type: SEARCH_FULFILLED,
            payload: {
              status: 200,
              statusText: undefined,
              headers: undefined,
              data: {},
            },
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor: sortedSearchDescriptor,
            },
          });
        });
    });

    it('should dispatch SEARCH_REJECTED when an unknown search column is specified', function test() {
      const store = mockStore({
        search: Immutable.Map(),
      });

      const sortedSearchDescriptor = Immutable.fromJS({
        recordType,
        searchQuery: Object.assign({}, searchQuery, {
          sort: 'foobar',
        }),
      });

      store.dispatch(search(config, searchName, sortedSearchDescriptor))
        .catch(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(1);

          actions[0].should.deep.equal({
            type: SEARCH_REJECTED,
            payload: {
              code: ERR_INVALID_SORT,
            },
            meta: {
              searchName,
              searchDescriptor: sortedSearchDescriptor,
            },
          });
        });
    });

    it('should dispatch SEARCH_REJECTED when an invalid search order is specified', function test() {
      const store = mockStore({
        search: Immutable.Map(),
      });

      const sortedSearchDescriptor = Immutable.fromJS({
        recordType,
        searchQuery: Object.assign({}, searchQuery, {
          sort: 'updatedAt foo',
        }),
      });

      store.dispatch(search(config, searchName, sortedSearchDescriptor))
        .catch(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(1);

          actions[0].should.deep.equal({
            type: SEARCH_REJECTED,
            payload: {
              code: ERR_INVALID_SORT,
            },
            meta: {
              searchName,
              searchDescriptor: sortedSearchDescriptor,
            },
          });
        });
    });

    it('should dispatch SEARCH_REJECTED on API error', function test() {
      moxios.stubRequest(searchUrl, {
        status: 400,
        response: {},
      });

      const store = mockStore({
        search: Immutable.Map(),
      });

      return store.dispatch(search(config, searchName, searchDescriptor))
        .then(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(2);

          actions[0].should.deep.equal({
            type: SEARCH_STARTED,
            meta: {
              listTypeConfig: listTypes.common,
              searchName,
              searchDescriptor,
            },
          });

          actions[1].should.have.property('type', SEARCH_REJECTED);
          actions[1].should.have.property('meta').that.deep.equals({
            searchName,
            searchDescriptor,
          });
        });
    });

    it('should dispatch SEARCH_REJECTED if the record type is unknown', function test() {
      const badSearchDescriptor = searchDescriptor.set('recordType', 'foobar');

      const store = mockStore({
        search: Immutable.Map(),
      });

      store.dispatch(search(config, searchName, badSearchDescriptor))
        .catch(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(1);

          actions[0].should.deep.equal({
            type: SEARCH_REJECTED,
            payload: {
              code: ERR_UNKNOWN_RECORD_TYPE,
            },
            meta: {
              searchName,
              searchDescriptor: badSearchDescriptor,
            },
          });
        });
    });

    it('should dispatch SEARCH_REJECTED if the record type does not have a service path', function test() {
      const badConfig = {
        listTypes,
        recordTypes: {
          [recordType]: {
            serviceConfig: {},
          },
        },
      };

      const store = mockStore({
        search: Immutable.Map(),
      });

      store.dispatch(search(badConfig, searchName, searchDescriptor))
        .catch(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(1);

          actions[0].should.deep.equal({
            type: SEARCH_REJECTED,
            payload: {
              code: ERR_UNKNOWN_RECORD_TYPE,
            },
            meta: {
              searchName,
              searchDescriptor,
            },
          });
        });
    });

    it('should dispatch SEARCH_REJECTED if the vocabulary does not have a service path', function test() {
      const badConfig = {
        listTypes,
        recordTypes: {
          [recordType]: {
            serviceConfig: {
              servicePath,
            },
            vocabularies: {
              [vocabulary]: {
                serviceConfig: {},
              },
            },
          },
        },
      };

      const store = mockStore({
        search: Immutable.Map(),
      });

      store.dispatch(search(badConfig, searchName, searchDescriptor))
        .catch(() => {
          const actions = store.getActions();

          actions.should.have.lengthOf(1);

          actions[0].should.deep.equal({
            type: SEARCH_REJECTED,
            payload: {
              code: ERR_UNKNOWN_VOCABULARY,
            },
            meta: {
              searchName,
              searchDescriptor,
            },
          });
        });
    });
  });

  describe('setResultItemSelected', function actionSuite() {
    const listTypes = {
      common: {
        listNodeName: 'ns2:abstract-common-list',
        itemNodeName: 'list-item',
      },
    };

    const config = {
      listTypes,
    };

    it('should dispatch SET_RESULT_ITEM_SELECTED', function test() {
      const searchName = 'searchName';

      const searchDescriptor = Immutable.fromJS({
        recordType: 'collectionobjects',
        searchQuery: {
          kw: 'foo',
        },
      });

      const index = 3;
      const checked = true;
      const listType = 'common';

      setResultItemSelected(config, searchName, searchDescriptor, listType, index, checked).should
        .deep.equal({
          type: SET_RESULT_ITEM_SELECTED,
          payload: checked,
          meta: {
            listTypeConfig: listTypes[listType],
            searchName,
            searchDescriptor,
            index,
          },
        });
    });
  });

  describe('clearSearchResults', function actionSuite() {
    it('should dispatch CLEAR_SEARCH_RESULTS', function test() {
      const searchName = 'searchName';

      clearSearchResults(searchName).should.deep.equal({
        type: CLEAR_SEARCH_RESULTS,
        meta: {
          searchName,
        },
      });
    });
  });

  describe('setAllResultItemsSelected', function actionSuite() {
    it('should dispatch SET_ALL_RESULT_ITEMS_SELECTED', function test() {
      const listType = 'common';

      const listTypeConfig = {
        listNodeName: 'ns2:abstract-common-list',
        itemNodeName: 'list-item',
      };

      const config = {
        listTypes: {
          [listType]: listTypeConfig,
        },
      };

      const searchName = 'searchName';

      const searchDescriptor = Immutable.fromJS({
        recordType: 'group',
      });

      const isSelected = true;
      const filter = () => true;

      setAllResultItemsSelected(
        config, searchName, searchDescriptor, listType, isSelected, filter
      ).should.deep.equal({
        type: SET_ALL_RESULT_ITEMS_SELECTED,
        payload: isSelected,
        meta: {
          filter,
          listTypeConfig,
          searchName,
          searchDescriptor,
        },
      });
    });
  });

  describe('clearSelected', function actionSuite() {
    it('should dispatch CLEAR_SELECTED', function test() {
      const searchName = 'searchName';

      clearSelected(searchName).should.deep.equal({
        type: CLEAR_SELECTED,
        meta: {
          searchName,
        },
      });
    });
  });

  describe('deselectResultItem', function actionSuite() {
    it('should dispatch DESELECT_RESULT_ITEM', function test() {
      const searchName = 'searchName';
      const csid = '1234';

      deselectResultItem(searchName, csid).should.deep.equal({
        type: DESELECT_RESULT_ITEM,
        meta: {
          searchName,
          csid,
        },
      });
    });
  });
});
