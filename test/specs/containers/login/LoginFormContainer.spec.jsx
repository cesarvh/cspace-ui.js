import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createRenderer } from 'react-test-renderer/shallow';
import Immutable from 'immutable';
import LoginForm from '../../../../src/components/login/LoginForm';
import LoginFormContainer from '../../../../src/containers/login/LoginFormContainer';

chai.should();

const mockStore = configureMockStore([]);

describe('LoginFormContainer', () => {
  it('should set props on LoginForm', () => {
    const username = 'user@collectionspace.org';

    const store = mockStore({
      login: Immutable.Map({
        username,
        isPending: true,
        error: null,
      }),
    });

    const context = { store };
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<LoginFormContainer />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(LoginForm);
    result.props.should.have.property('isPending', true);
    result.props.should.have.property('username', username);
    result.props.should.have.property('error', null);
    result.props.should.have.property('login').that.is.a('function');
  });
});
