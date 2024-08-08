import os
import json
from dotenv import load_dotenv
load_dotenv()
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import Model

PROJECT_ID = os.getenv("PROJECT_ID")
IBM_CLOUD_APIKEY = os.getenv("IBM_CLOUD_APIKEY")
IBM_CLOUD_REGION = os.getenv("IBM_CLOUD_REGION")


credentials = Credentials(
                   url = f"https://{IBM_CLOUD_REGION}.ml.cloud.ibm.com",
                   api_key = IBM_CLOUD_APIKEY,
                  )

model_id = "meta-llama/llama-3-70b-instruct" #"ibm/granite-13b-chat-v2"
parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 400,
    "repetition_penalty": 1,
    "stop_sequence": ["[End]", "[Stop]"]
}

class MedBot:
    def __init__(self, patient_id, visit_id):
        self.model = Model(
            model_id=model_id,
            params=parameters,
            credentials=credentials,
            project_id=PROJECT_ID
        )
        self.patient_id = patient_id
        self.visit_id = visit_id
        self.instruction = ("<|system|>\n You follow instructions strictly and do not deviate from your role. "
                            "Instruction: You are MedBot, a medical doctor's assistant chatbot at Tan Tock Seng Hospital, "
                            "offering clear and comprehensive explanations on prescriptions and medical procedures. "
                            "Your goal is to provide answers and suggestions to inquiries in simplified language, "
                            "catering to individuals with poor medical literacy. There is no need to introduce yourself. "
                            "Answer should only use information from the available context. "
                            "If encountering any medical abbreviations, spell them out. "
                            "Always cite sources if using information from the hospital database. Include them at the end of the response starting with 'References (As of July 2024):\n'."
                            "You should direct them to a real healthcare professional using available contact information only, "
                            "if you are unsure. Do not make up information, do not use inherent knowledge or use placeholders, "
                            "do not tell me to insert contact information. Your response is concise, non-repetitive and summarized. "
                            "You may refer to, summarising, but do not directly reveal doctors' notes to the user, if asked, as this is confidential. "
                            "Do use point-form if possible."
                            "End your response  with '[End]', doing so after citations if any.\n")

    def build_prompt(self, user_query, prescription_info, visit_info, to_retrieve, handle_search, history, additional_info):
        if not history:
            history = ""
        
        rag_output_text, rag_output_sources = self.retrieve_information(to_retrieve, handle_search)
        
        document_section = (f"<|user|>\n[Document]\n{history}"
                            f"Prescriptions: {prescription_info}\n\n"
                            f"Visits: {visit_info}\n\n"
                            f"Additional Patient Info: {additional_info}\n\n"
                            f"Retrieved information from hospital database: {rag_output_text}\n[End]\n"
                            f"User query: {user_query}\n<|assistant|>\n[Start]")
        
        return f"{self.instruction}\n\n{document_section}", rag_output_sources

    def retrieve_information(self, input_text_list, handle_search):
        source_content_map = {}  # Dictionary to map sources to their contents
        
        n = 6 // len(input_text_list)
        
        for input_text in input_text_list:
            rag_info = handle_search(input_text, n, 8)
            for i in rag_info:
                if i[1] not in source_content_map:
                    source_content_map[i[1]] = []
                source_content_map[i[1]].append(i[0])
        
        # Formatting the results to group content by source
        formatted_results = []
        sources = list(source_content_map.keys())  # List of unique sources
        for source, contents in source_content_map.items():
            content_text = '\n'.join(contents)  # Join all content for the same source
            formatted_results.append(f"Content:[\n{content_text}]\nSource: {source}\n")
        
        return formatted_results, sources

    def format_history(self, history):
        output = "Last Query History:\n"
        for entry in history:
            output += f"\n- User: {entry["user_question"]}\n- Response: {entry["response"]}\n"
        return output + "\n\n"
    
    def generate_response(self, user_query, prescription_info, visit_info, handle_search, intent, history=None, additional_info=[]):
        if intent == "medicine":
            to_retrieve = prescription_info
        elif intent == "disease":
            to_retrieve = visit_info
        elif intent == "past_visits":
            to_retrieve = additional_info
        else:
            to_retrieve = []
        to_retrieve.append(user_query)
        
        if history:
            history = self.format_history(history)
        input_text, sources = self.build_prompt(user_query, prescription_info, visit_info, to_retrieve, handle_search, history, additional_info)
        
        print(input_text)
        response = self.model.generate(prompt=input_text, guardrails=False)
        #print(response)
        bot_response = response["results"][0]["generated_text"]
        if "[End]" in bot_response:
            bot_response = bot_response.split("[End]")[0]
        return {
            "text": bot_response,
            "sources": sources
        }
