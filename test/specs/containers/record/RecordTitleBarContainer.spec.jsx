import React from 'react';
import configureMockStore from 'redux-mock-store';
import { createRenderer } from 'react-test-renderer/shallow';
import Immutable from 'immutable';
import RecordTitleBar from '../../../../src/components/record/RecordTitleBar';
import RecordTitleBarContainer from '../../../../src/containers/record/RecordTitleBarContainer';

chai.should();

const mockStore = configureMockStore([]);

describe('RecordTitleBarContainer', () => {
  it('should set props on RecordTitleBar', () => {
    const csid = '1234';
    const data = Immutable.Map();

    const store = mockStore({
      record: Immutable.fromJS({
        [csid]: {
          data: {
            current: data,
          },
          isReadPending: true,
        },
      }),
    });

    const context = { store };
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<RecordTitleBarContainer csid={csid} />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(RecordTitleBar);
    result.props.should.have.property('data', data);
    result.props.should.have.property('isReadPending', true);
  });
});
