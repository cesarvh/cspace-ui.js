import { defineMessages } from 'react-intl';

export default {
  authorityTypes: {
    values: [
      'Conceptitem',
      'Citation',
      'Locationitem',
      'Organization',
      'Person',
      'Placeitem',
      'Taxon',
      'Workitem',
    ],
    messages: defineMessages({
      Conceptitem: {
        id: 'option.authorityTypes.Conceptitem',
        defaultMessage: 'Concept',
      },
      Locationitem: {
        id: 'option.authorityTypes.Locationitem',
        defaultMessage: 'Location',
      },
      Placeitem: {
        id: 'option.authorityTypes.Placeitem',
        defaultMessage: 'Place',
      },
      Workitem: {
        id: 'option.authorityTypes.Workitem',
        defaultMessage: 'Work',
      },
    }),
  },
};


