import fields from './fields';
import forms from './forms';
import optionLists from './optionLists';

export default () => configContext => ({
  optionLists,
  invocables: {
    batch: {
      'Merge Authority Items': {
        fields: fields(configContext),
        forms: forms(configContext),
      },
    },
  },
});