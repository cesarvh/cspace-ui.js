import serviceConfig from '../../../../../src/plugins/recordTypes/intake/serviceConfig';

chai.should();

describe('intake record serviceConfig', () => {
  it('should have servicePath property', () => {
    serviceConfig.should.have.property('servicePath').that.is.a('string');
    serviceConfig.should.have.property('serviceName').that.is.a('string');
    serviceConfig.should.have.property('serviceType').that.is.a('string');
    serviceConfig.should.have.property('objectName').that.is.a('string');
    serviceConfig.should.have.property('documentName').that.is.a('string');
  });
});
