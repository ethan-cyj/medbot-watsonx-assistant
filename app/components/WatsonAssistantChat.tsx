import { useEffect } from 'react';

const WatsonAssistantChat = ({ patient_id, visit_id }: { patient_id: number, visit_id: number }) => {
  useEffect(() => {
    window.watsonAssistantChatOptions = {
      integrationID: "40c592a6-ac8c-42d5-a786-03dfdb09007d", // The ID of this integration.
      region: "us-south", // The region your integration is hosted in.
      serviceInstanceID: "c4d86c9a-ff5b-4279-9bf0-ce7948c3d948", // The ID of your service instance.
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
