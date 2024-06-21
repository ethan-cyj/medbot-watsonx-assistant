import { useEffect } from 'react';

const WatsonAssistantChat = ({ patient_id, visit_id }: { patient_id: number, visit_id: number }) => {
  useEffect(() => {
    window.watsonAssistantChatOptions = {
      integrationID: '80442eb6-9c08-40bd-9435-634ff0cb5b80', // The ID of this integration.
      region: 'us-south', // The region your integration is hosted in.
      serviceInstanceID: '241a1cf1-b75c-423a-bb2a-5534a3bb9cc3', // The ID of your service instance.
      //openChatByDefault: true,
      onLoad: async (instance) => {
        await instance.restartConversation();
        const sendObject = { 
            input: {
                'message_type': 'text',
                'text': '',
            },
            context: {
              skills: {
                ['actions skill']: {
                  skill_variables: {
                    patient_id: patient_id,
                    visit_id: visit_id
                  }
                }
              }
            }
          };
        await instance.send(sendObject);
        await instance.render();
        await instance.toggleOpen();
      },
    };

    setTimeout(() => {
      const script = document.createElement('script');
      script.src =
        'https://web-chat.global.assistant.watson.appdomain.cloud/versions/' +
        (window.watsonAssistantChatOptions.clientVersion || 'latest') +
        '/WatsonAssistantChatEntry.js';
      document.head.appendChild(script);
    }, 0);
  }, [patient_id, visit_id]);

  return null;
};

export default WatsonAssistantChat;
