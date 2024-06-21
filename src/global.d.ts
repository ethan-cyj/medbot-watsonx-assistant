declare global {
    interface Window {
      watsonAssistantChatOptions: {
        integrationID: string;
        region: string;
        serviceInstanceID: string;
        onLoad: (instance: any) => void;
        clientVersion?: string;
        openChatByDefault?: boolean;
      };
    }
  }
  
  export {};
  