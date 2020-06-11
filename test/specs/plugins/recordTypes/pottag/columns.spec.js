import createColumns from '../../../../../src/plugins/recordTypes/pottag/columns';
import createConfigContext from '../../../../../src/helpers/createConfigContext';

chai.should();

describe('pot tag record columns', () => {
  const configContext = createConfigContext();
  const columns = createColumns(configContext);

  const config = {
    optionLists: {
      printLabelOptions: {
        messages: {
          value1: {
            id: 'option.printLabelOptions.value1',
            defaultMessage: 'Value 1',
          },
        },
      },
    },
  };

  const intl = {
    formatMessage: (message) => `formatted ${message.id}`,
  };

  it('should have the correct shape', () => {
    columns.should.have.property('default').that.is.an('object');
  });

  it('should have family column that is formatted as a refname display name', () => {
    const familyColumn = columns.default.family;

    familyColumn.should.have.property('formatValue').that.is.a('function');

    familyColumn.formatValue('urn:cspace:botgarden.collectionspace.org:taxonomyauthority:name(taxon):item:name(PTFamily1501262583720)\'PTFamily\'').should
      .equal('PTFamily');
  });

  it('should have taxonName column that is formatted as a refname display name', () => {
    const taxonNameColumn = columns.default.taxonName;

    taxonNameColumn.should.have.property('formatValue').that.is.a('function');

    taxonNameColumn.formatValue('urn:cspace:botgarden.collectionspace.org:taxonomyauthority:name(taxon):item:name(TaxonName1501262583720)\'TaxonName\'').should
      .equal('TaxonName');
  });

  it('should have print labels column that is formatted as an option list value', () => {
    const printLabelsColumn = columns.default.printLabels;

    printLabelsColumn.should.have.property('formatValue').that.is.a('function');

    printLabelsColumn.formatValue('value1', { intl, config }).should
      .equal('formatted option.printLabelOptions.value1');
  });
});
