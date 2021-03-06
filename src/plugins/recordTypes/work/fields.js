import { defineMessages } from 'react-intl';

export default (configContext) => {
  const {
    AutocompleteInput,
    CompoundInput,
    DateInput,
    HierarchyInput,
    OptionPickerInput,
    TextInput,
    TermPickerInput,
    CheckboxInput,
    StructuredDateInput,
  } = configContext.inputComponents;

  const {
    configKey: config,
  } = configContext.configHelpers;

  const {
    DATA_TYPE_BOOL,
    DATA_TYPE_STRUCTURED_DATE,
  } = configContext.dataTypes;

  const {
    extensions,
  } = configContext.config;

  return {
    document: {
      [config]: {
        view: {
          type: CompoundInput,
          props: {
            defaultChildSubpath: 'ns2:works_common',
          },
        },
      },
      'rel:relations-common-list': {
        [config]: {
          service: {
            ns: 'http://collectionspace.org/services/relation',
          },
        },
        'relation-list-item': {
          [config]: {
            view: {
              type: HierarchyInput,
              props: {
                messages: defineMessages({
                  parent: {
                    id: 'hierarchyInput.work.parent',
                    defaultMessage: 'Broader work',
                  },
                  children: {
                    id: 'hierarchyInput.work.children',
                    defaultMessage: 'Narrower works',
                  },
                  siblings: {
                    id: 'hierarchyInput.work.siblings',
                    defaultMessage: 'Adjacent works',
                  },
                }),
              },
            },
          },
        },
      },
      ...extensions.core.fields,
      'ns2:works_common': {
        [config]: {
          service: {
            ns: 'http://collectionspace.org/services/work',
          },
        },
        csid: {
          [config]: {
            cloneable: false,
          },
        },
        inAuthority: {
          [config]: {
            cloneable: false,
          },
        },
        refName: {
          [config]: {
            cloneable: false,
          },
        },
        shortIdentifier: {
          [config]: {
            cloneable: false,
          },
        },
        workTermGroupList: {
          [config]: {
            messages: defineMessages({
              required: {
                id: 'field.works_common.workTermGroupList.required',
                defaultMessage: 'At least one term display name is required. Please enter a value.',
              },
            }),
            required: true,
            view: {
              type: CompoundInput,
            },
          },
          workTermGroup: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.works_common.workTermGroup.name',
                  defaultMessage: 'Term',
                },
              }),
              repeating: true,
              view: {
                type: CompoundInput,
              },
            },
            termDisplayName: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termDisplayName.name',
                    defaultMessage: 'Display name',
                  },
                }),
                required: true,
                view: {
                  type: TextInput,
                },
              },
            },
            termName: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termName.name',
                    defaultMessage: 'Name',
                  },
                }),
                view: {
                  type: TextInput,
                  props: {
                    // Suppress Chrome autofill
                    autoComplete: 'cspace-name',
                  },
                },
              },
            },
            termType: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termType.name',
                    defaultMessage: 'Type',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
            termFlag: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.works_common.termFlag.fullName',
                    defaultMessage: 'Term flag',
                  },
                  name: {
                    id: 'field.works_common.termFlag.name',
                    defaultMessage: 'Flag',
                  },
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'worktermflag',
                  },
                },
              },
            },
            termStatus: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termStatus.name',
                    defaultMessage: 'Status',
                  },
                }),
                view: {
                  type: OptionPickerInput,
                  props: {
                    source: 'workTermStatuses',
                  },
                },
              },
            },
            termQualifier: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termQualifier.name',
                    defaultMessage: 'Qualifier',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
            termLanguage: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.works_common.termLanguage.fullName',
                    defaultMessage: 'Term language',
                  },
                  name: {
                    id: 'field.works_common.termLanguage.name',
                    defaultMessage: 'Language',
                  },
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'languages',
                  },
                },
              },
            },
            termPrefForLang: {
              [config]: {
                dataType: DATA_TYPE_BOOL,
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termPrefForLang.name',
                    defaultMessage: 'Preferred for lang',
                  },
                }),
                view: {
                  type: CheckboxInput,
                },
              },
            },
            termSource: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termSource.name',
                    defaultMessage: 'Name',
                  },
                  fullName: {
                    id: 'field.works_common.termSource.fullName',
                    defaultMessage: 'Source name',
                  },
                }),
                view: {
                  type: AutocompleteInput,
                  props: {
                    source: 'citation/local,citation/shared,citation/worldcat',
                  },
                },
              },
            },
            termSourceDetail: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termSourceDetail.name',
                    defaultMessage: 'Detail',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
            termSourceID: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termSourceID.name',
                    defaultMessage: 'ID',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
            termSourceNote: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.termSourceNote.name',
                    defaultMessage: 'Note',
                  },
                }),
                view: {
                  type: TextInput,
                },
              },
            },
          },
        },
        workType: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.works_common.workType.name',
                defaultMessage: 'Work type',
              },
            }),
            view: {
              type: TermPickerInput,
              props: {
                source: 'worktype',
              },
            },
          },
        },
        workDateGroupList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          workDateGroup: {
            [config]: {
              dataType: DATA_TYPE_STRUCTURED_DATE,
              messages: defineMessages({
                name: {
                  id: 'field.works_common.workDateGroup.name',
                  defaultMessage: 'Work date',
                },
              }),
              repeating: true,
              searchView: {
                type: DateInput,
              },
              view: {
                type: StructuredDateInput,
              },
            },
            ...extensions.structuredDate.fields,
          },
        },
        workHistoryNote: {
          [config]: {
            messages: defineMessages({
              name: {
                id: 'field.works_common.workHistoryNote.name',
                defaultMessage: 'History note',
              },
            }),
            view: {
              type: TextInput,
              props: {
                multiline: true,
              },
            },
          },
        },
        creatorGroupList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          creatorGroup: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.works_common.creatorGroup.name',
                  defaultMessage: 'Creator',
                },
              }),
              repeating: true,
              view: {
                type: CompoundInput,
                props: {
                  tabular: true,
                },
              },
            },
            creator: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.creator.name',
                    defaultMessage: 'Name',
                  },
                  fullName: {
                    id: 'field.works_common.creator.fullName',
                    defaultMessage: 'Creator name',
                  },
                }),
                view: {
                  type: AutocompleteInput,
                  props: {
                    source: 'person/local,person/shared,organization/local,organization/shared',
                  },
                },
              },
            },
            creatorType: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.works_common.creatorType.fullName',
                    defaultMessage: 'Creator type',
                  },
                  name: {
                    id: 'field.works_common.creatorType.name',
                    defaultMessage: 'Type',
                  },
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'workcreatortype',
                  },
                },
              },
            },
          },
        },
        publisherGroupList: {
          [config]: {
            view: {
              type: CompoundInput,
            },
          },
          publisherGroup: {
            [config]: {
              messages: defineMessages({
                name: {
                  id: 'field.works_common.publisherGroup.name',
                  defaultMessage: 'Publisher',
                },
              }),
              repeating: true,
              view: {
                type: CompoundInput,
                props: {
                  tabular: true,
                },
              },
            },
            publisher: {
              [config]: {
                messages: defineMessages({
                  name: {
                    id: 'field.works_common.publisher.name',
                    defaultMessage: 'Name',
                  },
                  fullName: {
                    id: 'field.works_common.publisher.fullName',
                    defaultMessage: 'Publisher name',
                  },
                }),
                view: {
                  type: AutocompleteInput,
                  props: {
                    source: 'person/local,person/shared,organization/local,organization/shared',
                  },
                },
              },
            },
            publisherType: {
              [config]: {
                messages: defineMessages({
                  fullName: {
                    id: 'field.works_common.publisherType.fullName',
                    defaultMessage: 'Publisher type',
                  },
                  name: {
                    id: 'field.works_common.publisherType.name',
                    defaultMessage: 'Type',
                  },
                }),
                view: {
                  type: TermPickerInput,
                  props: {
                    source: 'workpublishertype',
                  },
                },
              },
            },
          },
        },
        ...extensions.address.fields,
      },
    },
  };
};
