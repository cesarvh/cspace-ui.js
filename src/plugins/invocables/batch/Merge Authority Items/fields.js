import { defineMessages } from 'react-intl';

export default (configContext) => {
  const {
    CompoundInput,
    TextInput,
    OptionPickerInput,
  } = configContext.inputComponents;

  const {
    configKey: config,
  } = configContext.configHelpers;

  return {
    params: {
      [config]: {
        view: {
          type: CompoundInput,
        },
      },
      targetCsid: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.batch.Merge Authority Items.targetCsid.name',
              defaultMessage: 'Target CSID',
            },
          }),
          required: true,
          view: {
            type: TextInput,
          },
        },
      },
      sourceCsids: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.batch.Merge Authority Items.sourceCsids.name',
              defaultMessage: 'Source CSIDs',
            },
          }),
          required: true,
          view: {
            type: TextInput,
          },
        },
      },
      docType: {
        [config]: {
          messages: defineMessages({
            name: {
              id: 'field.batch.Merge Authority Items.docType.name',
              defaultMessage: 'Document type',
            },
          }),
          required: true,
          view: {
            type: OptionPickerInput,
            props: {
              source: 'authorityTypes',
            },
          },
        },
      },
    },
  };
};