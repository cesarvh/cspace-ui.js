import { connect } from 'react-redux';
import BatchPage from '../../components/pages/BatchPage';

import {
  invoke,
} from '../../actions/batch';

import {
  closeModal,
  openModal,
} from '../../actions/notification';

import {
  setToolTab,
} from '../../actions/prefs';

import {
  getOpenModalName,
  getUserPerms,
} from '../../reducers';

const mapStateToProps = state => ({
  openModalName: getOpenModalName(state),
  perms: getUserPerms(state),
});

const mapDispatchToProps = {
  closeModal,
  openModal,
  setToolTab,
  invoke,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BatchPage);
