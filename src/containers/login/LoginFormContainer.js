import { connect } from 'react-redux';
import LoginForm from '../../components/login/LoginForm';
import { login } from '../../actions/login';

import {
  getLoginUsername,
  isLoginPending,
  isLoginSuccess,
  getLoginError,
} from '../../reducers';

const mapStateToProps = (state) => ({
  isPending: isLoginPending(state),
  isSuccess: isLoginSuccess(state),
  username: getLoginUsername(state),
  error: getLoginError(state),
});

const mapDispatchToProps = {
  login,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);
