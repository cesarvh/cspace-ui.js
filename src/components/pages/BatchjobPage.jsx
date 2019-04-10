import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { FormattedMessage, defineMessages } from 'react-intl';
import get from 'lodash/get';
import { OP_CONTAIN, OP_EQ, OP_AND } from '../../constants/searchOperators';
import RecordEditorContainer from '../../containers/record/RecordEditorContainer';
import SearchPanelContainer from '../../containers/search/SearchPanelContainer';
import { disallowCreate, disallowDelete, disallowSoftDelete, canRead } from '../../helpers/permissionHelpers';
import styles from '../../../styles/cspace-ui/AdminTab.css';
import TitleBar from '../sections/TitleBar';
import InvocablesSearchBar from '../invocable/InvocablesSearchBar';

const messages = defineMessages({
  title: {
    id: 'batchjobPage.title',
    defaultMessage: 'Batch',
  },
});

const propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  perms: PropTypes.instanceOf(Immutable.Map),
  filterDelay: PropTypes.number,
};

const defaultProps = {
  filterDelay: 500,
};

const contextTypes = {
  config: PropTypes.object.isRequired,
};

const recordType = 'batch';

const getSearchDescriptor = () => Immutable.fromJS({
  recordType,
  searchQuery: {
    // as: {
      // value: 1,
      // op: OP_EQ,
      // path: 'ns2:batch_common/supportsParams'
    // },
    size: 20,
  },
});

export default class BatchjobPage extends Component {
  constructor() {
    super();

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleSearchBarChange = this.handleSearchBarChange.bind(this);
    this.handleSearchDescriptorChange = this.handleSearchDescriptorChange.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);

    this.state = {
      searchDescriptor: getSearchDescriptor(),
      isModalOpen: false,
    };
  }

  filter(value) {
    // TO DO
  }

  handleItemClick(item) {
    // TO DO
  }

  handleSearchBarChange() {
    // TO DO
  }

  handleSearchDescriptorChange() {
    // TO DO
  }

  renderSearchBar()  {
    const {
      filterValue,
    } = this.state;

    return (
      <InvocablesSearchBar
        value={filterValue}
        onChange={this.handleSearchBarChange}
      />
    );
  }

  render() {
    const {
      config,
    } = this.context

    const {
      filterValue,
      searchDescriptor,
      currentItem,
    } = this.state;

    const {
      history,
      match,
      perms,
    } = this.props;

    const {
      csid,
    } = match.params;

    const normalizedCsid = (csid === 'new') ? '' : csid;
    const recordTypeConfig = get(config, ['recordTypes', recordType]);

    const panelTitle = <FormattedMessage {...recordTypeConfig.messages.record.collectionName} />;
    const title = <FormattedMessage {...messages.title} />;

    let recordEditor;

    if (typeof normalizedCsid !== 'undefined' && normalizedCsid !== null) {
      // Disable creating and deleting

      let restrictedPerms = perms;

      restrictedPerms = disallowCreate(recordType, restrictedPerms);
      restrictedPerms = disallowDelete(recordType, restrictedPerms);
      restrictedPerms = disallowSoftDelete(recordType, restrictedPerms);

      recordEditor = (
        <RecordEditorContainer
          config={config}
          csid={normalizedCsid}
          recordType={recordType}
          perms={restrictedPerms}
          reportItem={currentItem}
        />
      );
    }

    return (
      <div>
        <TitleBar title={title} updateDocumentTitle />
        <div className={styles.common}>
          <SearchPanelContainer 
            config={config}
            history={history}
            isFiltered={!!filterValue}
            linkItems={false}
            name={"BatchjobPage"}
            searchDescriptor={searchDescriptor}
            title={panelTitle}
            recordType={recordType}
            showSearchButton={false}
            renderTableHeader={this.renderSearchBar}
            onItemClick={this.handleItemClick}
            onSearchDescriptorChange={this.handleSearchDescriptorChange}
          />
          {recordEditor}
        </div>
      </div>
    );
  };
};

BatchjobPage.propTypes = propTypes;
BatchjobPage.defaultProps = defaultProps;
BatchjobPage.contextTypes = contextTypes;