import columns from './columns';
import messages from './messages';
import serviceConfig from './serviceConfig';
import forms from './forms';
import fields from './fields';

export default () => configContext => ({
  recordTypes: {
    batch: {
      forms: forms(configContext),
      fields: fields(configContext),
      messages,
      serviceConfig,
      columns: columns(configContext),
    },
  },
});
