import columns from './columns';
import invocableName from './invocableName';
import messages from './messages';
import serviceConfig from './serviceConfig';
import title from './title';
import forms from './forms';
import fields from './fields';

export default () => configContext => ({
  recordTypes: {
    batch: {
      messages,
      serviceConfig,
      forms: forms(configContext),
      fields: fields(configContext),
      columns: columns(configContext),
      invocableName: invocableName(configContext),
      title: title(configContext),
    },
  },
});
