import { useEffect } from 'react';

const WatsonAssistantChat = () => {
  useEffect(() => {
    window.watsonAssistantChatOptions = {
      integrationID: '80442eb6-9c08-40bd-9435-634ff0cb5b80', // The ID of this integration.
      region: 'us-south', // The region your integration is hosted in.
      serviceInstanceID: '241a1cf1-b75c-423a-bb2a-5534a3bb9cc3', // The ID of your service instance.
      onLoad: async (instance) => {
        await instance.render();
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
  }, []);

  return null;
};

export default WatsonAssistantChat;
