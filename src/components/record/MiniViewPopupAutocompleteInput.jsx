/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { components as inputComponents, enhancers as inputEnhancers } from 'cspace-input';
import MiniViewPopup from './MiniViewPopup';
import AutocompleteInputContainer from '../../containers/input/AutocompleteInputContainer';
import { canRead } from '../../helpers/permissionHelpers';

import {
  refNameToCsid,
  getRecordType,
  getVocabulary,
} from '../../../src/helpers/refNameHelpers';

import styles from '../../../styles/cspace-ui/MiniViewPopupAutocompleteInput.css';

const { AutocompleteInput } = inputComponents;

const {
  labelable,
  repeatable,
} = inputEnhancers;

const propTypes = {
  ...AutocompleteInput.propTypes,
  openDelay: PropTypes.number,
  perms: PropTypes.instanceOf(Immutable.Map),
  clearRecord: PropTypes.func,
};

const defaultProps = {
  openDelay: 500,
};

const contextTypes = {
  config: PropTypes.object,
};

export class BaseMiniViewPopupAutocompleteInput extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownClose = this.handleDropdownClose.bind(this);
    this.handleDropdownOpen = this.handleDropdownOpen.bind(this);
    this.handleItemMouseEnter = this.handleItemMouseEnter.bind(this);
    this.handleItemMouseLeave = this.handleItemMouseLeave.bind(this);
    this.handleMiniViewMouseEnter = this.handleMiniViewMouseEnter.bind(this);
    this.handleMiniViewPopupDomRef = this.handleMiniViewPopupDomRef.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleRef = this.handleRef.bind(this);

    this.state = {
      isOpen: false,
    };

    this.openedCsids = new Set();
  }

  componentWillUnmount() {
    const {
      clearRecord,
    } = this.props;

    if (clearRecord) {
      this.openedCsids.forEach(clearRecord);
    }
  }

  cancelClose() {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);

      this.openTimer = null;
    }
  }

  cancelOpen() {
    if (this.openTimer) {
      window.clearTimeout(this.openTimer);

      this.openTimer = null;
    }
  }

  close() {
    this.cancelOpen();
    this.cancelClose();

    if (this.domNode && this.state.isOpen) {
      this.setState({
        isOpen: false,
        value: null,
        element: null,
      });
    }
  }

  open(value, element) {
    this.cancelOpen();
    this.cancelClose();

    this.setState({
      isOpen: true,
      value,
      element,
    });
  }

  handleDropdownClose() {
    this.close();

    this.state = {
      isFiltering: false,
    };
  }

  handleDropdownOpen() {
    this.close();

    this.setState({
      isFiltering: true,
    });
  }

  handleItemMouseEnter(value, element) {
    this.cancelClose();

    this.openTimer = setTimeout(() => {
      this.open(value, element);
    }, this.props.openDelay);
  }

  handleItemMouseLeave() {
    this.cancelOpen();

    this.closeTimer = window.setTimeout(() => {
      this.close();
    }, this.props.openDelay);
  }

  handleMiniViewMouseEnter() {
    this.cancelClose();
    this.cancelOpen();
  }

  handleMiniViewPopupDomRef(ref) {
    this.miniViewPopupDomNode = ref;
  }

  handleMouseEnter() {
    const {
      isFiltering,
      isOpen,
    } = this.state;

    if (!isFiltering && !isOpen) {
      this.openTimer = setTimeout(() => {
        this.open(this.props.value);
      }, this.props.openDelay);
    }
  }

  handleMouseLeave() {
    this.close();
  }

  handleRef(ref) {
    this.domNode = ref;
  }

  renderMiniViewPopup() {
    const {
      isOpen,
      value,
      element,
    } = this.state;

    if (!value || !isOpen) {
      return undefined;
    }

    const {
      perms,
    } = this.props;

    const {
      config,
    } = this.context;

    const csid = refNameToCsid(value);
    const recordType = getRecordType(config, value);
    const vocabulary = getVocabulary(config, value);

    if (!recordType || !csid) {
      return undefined;
    }

    if (!canRead(recordType, perms)) {
      return undefined;
    }

    let style;

    if (element) {
      const inputRect = this.domNode.getBoundingClientRect();
      const itemRect = element.getBoundingClientRect();

      style = {
        left: itemRect.right - 24,
        top: itemRect.top - inputRect.top - inputRect.height,
      };
    }

    this.openedCsids.add(csid);

    return (
      <MiniViewPopup
        config={config}
        recordType={recordType}
        vocabulary={vocabulary}
        csid={csid}
        style={style}
        domRef={this.handleMiniViewPopupDomRef}
        onMouseEnter={this.handleMiniViewMouseEnter}
      />
    );
  }

  render() {
    const {
      /* eslint-disable no-unused-vars */
      openDelay,
      perms,
      clearRecord,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const {
      isFiltering,
    } = this.state;

    const className = this.props.embedded ? styles.embedded : styles.normal;

    let popup;
    let filteringPopup;

    if (isFiltering) {
      filteringPopup = this.renderMiniViewPopup();
    } else {
      popup = this.renderMiniViewPopup();
    }

    return (
      <div
        className={className}
        ref={this.handleRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <AutocompleteInputContainer
          {...remainingProps}
          onClose={this.handleDropdownClose}
          onOpen={this.handleDropdownOpen}
          onItemMouseEnter={this.handleItemMouseEnter}
          onItemMouseLeave={this.handleItemMouseLeave}
          menuFooter={filteringPopup}
        />
        {popup}
      </div>
    );
  }
}

BaseMiniViewPopupAutocompleteInput.propTypes = propTypes;
BaseMiniViewPopupAutocompleteInput.defaultProps = defaultProps;
BaseMiniViewPopupAutocompleteInput.contextTypes = contextTypes;

export default repeatable(labelable(BaseMiniViewPopupAutocompleteInput));