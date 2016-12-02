import serviceConfig from '../../../../../src/plugins/recordTypes/group/serviceConfig';

chai.should();

describe('group record serviceConfig', function suite() {
  it('should have name and parts properties', function test() {
    serviceConfig.should.have.property('name').that.is.a('string');
    serviceConfig.should.have.property('parts').that.is.an('object');
  });
});
