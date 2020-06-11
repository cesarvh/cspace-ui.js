import Immutable from 'immutable';
import createTitleGetter from '../../../../../src/plugins/recordTypes/pottag/title';
import createConfigContext from '../../../../../src/helpers/createConfigContext';

chai.should();

describe('pot tag record title', () => {
  const configContext = createConfigContext();
  const title = createTitleGetter(configContext);

  it('should concat the common name and family', () => {
    const data = Immutable.fromJS({
      document: {
        'ns2:pottags_common': {
          commonName: 'Rose',
          family: 'urn:cspace:botgarden.collectionspace.org:taxonomyauthority:name(taxon):item:name(PTFamily1501262583720)\'PTFamily\'',
        },
      },
    });

    title(data).should.equal('Rose – PTFamily');
  });

  it('should return the common name when family field is empty', () => {
    const data = Immutable.fromJS({
      document: {
        'ns2:pottags_common': {
          commonName: 'Rose',
          family: '',
        },
      },
    });

    title(data).should.equal('Rose');
  });

  it('should return empty string if no data is passed', () => {
    title(null).should.equal('');
    title(undefined).should.equal('');
  });

  it('should return empty string if the common part is not present', () => {
    const data = Immutable.fromJS({
      document: {
        'ns2:pottags_extension': {
          commonName: 'Something',
        },
      },
    });

    title(data).should.equal('');
  });
});
