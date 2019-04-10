import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Helmet from 'react-helmet';
import classNames from 'classnames';
import ProtectedRouteContainer from '../../containers/routes/ProtectedRouteContainer';
import PublicRoute from '../routes/PublicRoute';
import AdminPageContainer from '../../containers/pages/AdminPageContainer';
import ConfigPage from './ConfigPage';
import ContentViewerPageContainer from '../../containers/pages/ContentViewerPageContainer';
import CreatePageContainer from '../../containers/pages/CreatePageContainer';
import DashboardPage from './DashboardPage';
import LoginPageContainer from '../../containers/pages/LoginPageContainer';
import LogoutPageContainer from '../../containers/pages/LogoutPageContainer';
import RecordPageContainer from '../../containers/pages/RecordPageContainer';
import ReportViewerPageContainer from '../../containers/pages/ReportViewerPageContainer';
import ResetPasswordPage from './ResetPasswordPage';
import SearchPageContainer from '../../containers/pages/SearchPageContainer';
import SearchResultPageContainer from '../../containers/pages/SearchResultPageContainer';
import NotificationBarContainer from '../../containers/notification/NotificationBarContainer';
import styles from '../../../styles/cspace-ui/RootPage.css';
import favicon from '../../../images/favicon.png';

const messages = defineMessages({
  title: {
    id: 'rootPage.title',
    description: 'The title of the application, displayed in the browser tab.',
    defaultMessage: 'CollectionSpace',
  },
});

const propTypes = {
  className: PropTypes.string,
  intl: intlShape,
};

function RootPage(props) {
  const {
    className,
    intl,
  } = props;

  const classes = classNames(styles.common, className);
  const title = intl.formatMessage(messages.title);

  return (
    <div className={classes}>
      <Helmet
        defaultTitle={title}
        titleTemplate={`%s | ${title}`}
      >
        {/*
          * TODO: Generate a full set of icons to support a range of platforms (e.g. using
          * http://realfavicongenerator.net/)
          */}

        <link rel="shortcut icon" href={favicon} />
      </Helmet>

      <Switch>
        <PublicRoute path="/login" component={LoginPageContainer} />
        <PublicRoute path="/logout" component={LogoutPageContainer} />
        <PublicRoute path="/config" component={ConfigPage} />
        <PublicRoute path="/resetpw" component={ResetPasswordPage} />

        <ProtectedRouteContainer path="/dashboard" component={DashboardPage} />
        <ProtectedRouteContainer path="/create" component={injectIntl(CreatePageContainer)} />
        <ProtectedRouteContainer path="/admin" component={AdminPageContainer} />
        <ProtectedRouteContainer 
          path="/batch/:recordType?/:csid?" 
          component={BatchJobPageContainer}
        />

        <ProtectedRouteContainer
          path="/search/:recordType?/:vocabulary?"
          component={SearchPageContainer}
        />

        <ProtectedRouteContainer
          path="/list/:recordType/:vocabulary/:csid/:subresource"
          component={SearchResultPageContainer}
        />

        <ProtectedRouteContainer
          path="/list/:recordType/:csid/:subresource"
          component={SearchResultPageContainer}
        />

        <ProtectedRouteContainer
          path="/list/:recordType/:vocabulary?"
          component={SearchResultPageContainer}
        />

        <ProtectedRouteContainer
          path="/record/:recordType/:path1?/:path2?/:path3?"
          component={RecordPageContainer}
        />

        <ProtectedRouteContainer
          path="/view/:contentPath+"
          component={ContentViewerPageContainer}
          decorated={false}
        />

        <ProtectedRouteContainer
          path="/report/:reportCsid"
          component={ReportViewerPageContainer}
          decorated={false}
        />
      </Switch>

      <NotificationBarContainer />
    </div>
  );
}

RootPage.propTypes = propTypes;

export default injectIntl(RootPage);
