# MedBot Watsonx Assistant

This repository contains a Next.js application integrated with Watson Assistant and a backend Flask application for handling LLM search and Cloudant DB interactions.

## Table of Contents

- [Getting Started](#getting-started)
- [Deployed Usage](#deployed-usage)
- [Watsonx Assistant Actions](#watsonx-assistant-actions)
- [Docker Image](#docker-image)
- [Components](#components)
- [Set Up](#set-up)
- [Deployment](#deployment)
- [License](#license)

## Getting Started

To run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployed Usage

A QR code can be generated to open the following URL:
```
https://medbot-watsonx-assistant.vercel.app/?patient_id=1&visit_id=1
```
where `patient_id` and `visit_id` are variable.

- The `patient_id` and `visit_id` are passed into `watsonAssistantChatOptions` to initialize Watson Assistant with the corresponding session variables.
- These variables are then used to retrieve the rest of the patient's information from the Cloudant DB.

## Watsonx Assistant Actions

### LLM Generation Actions

These actions utilize the LLM generation extension:

1. **Explain Prescription**
    - **Example Query**: "What does my medicine do?"
    - **Description**: This action takes in patient information, visit information, prescription information, and the chat's last query and response history.
    - **Intent**: Set to "medicine".
    - **Process**: RAG search is performed on each of the prescription items. Ideally, we have crawled and indexed every drug information sheet available from the TTSH website.

2. **Explain Condition**
    - **Example Query**: "What are the next steps for my treatment plan?"
    - **Description**: This action takes in patient information, visit information, prescription information, and the chat's last query and response history.
    - **Intent**: Set to "disease".
    - **Process**: RAG search is performed using the current visit's information, which includes doctor's notes, follow-up appointments, and other instructions for that visit.

3. **General Question**
    - **Example Query**: Triggered when no other action is matched, or as a fallback from another action.
    - **Description**: Intent is set to "general".
    - **Process**: Search is performed using the user query only. The LLM's instructions are designed to strictly imitate a medical doctor's assistant, and therefore will not entertain non-medical related questions.

### Other Actions

4. **Greeting**
    - **Description**: This action is triggered upon initialization.
    - **Process**: Based on `visit_id` and `patient_id`, the custom extension retrieves the patient's info from Cloudant (or whatever patient database is used). Ideally, this will include an authentication step, such as Singpass Login.

5. **Refill Prescription**
    - **Example Query**: "I need more painkiller meds"
    - **Description**: Guides the patient step-by-step through the process of making a prescription refill order and delivery.
    - **Process**: If the medication is a controlled substance, the patient is redirected to make a new appointment for it.

6. **Manage Appointments**
    - **Example Query**: "When are my next appointments?"
    - **Description**: Provides a step-by-step process for creating, modifying, and canceling appointments.

## Docker Image

### Components

- **documents**: Contains some text files about certain medical and admin information taken from the TTSH Hospital website.
- **indexing.ipynb**:
    - Preprocessing of hospital documents.
    - Insertion of documents into a COS bucket.
    - Setup and ingestion of documents from COS into Elasticsearch index.
    - Creation of Cloudant DB and insertion of dummy patient info.
- **cloudant.py**:
    - Initialization of Cloudant client.
    - `query_patient_info()`: Retrieves patient info based on `visit_id` and `patient_id`.
- **llm.py**:
    - Initializes MedBot instance.
    - Builds prompt based on provided inputs and query intent given by Watson Assistant.
    - `generate_response()`: Returns a response generated from the llama-3-70b-instruct model, via watsonx.ai.
- **search.py**:
    - Initializes Elasticsearch client.
    - Provides `handle_search()` which MedBot instance uses for a semantic search (ELSER) of hospital documents.
- **app.py**:
    - Flask app providing the following POST endpoints used in our OpenAPI specification:
        - `/generate_response`
        - `/get_patient`
    - See `openapi.yaml` for the OpenAPI spec.

## Set Up

### Prerequisites to Provision

- Watsonx.ai
- Watsonx Discovery (an Elasticsearch account)
- IBM Cloud Registry: Using the free tier
- IBM Code Engine
- Watson Assistant

#### Environment Variables
ElasticSearch
- ESUSER 
- ESPASSWORD
- ESHOST
- ESPORT

Watsonx.ai
- PROJECT_ID
- SPACE_ID

IBM Cloud
- IBM_CLOUD_APIKEY
- IBM_CLOUD_REGION
- COS_ASSET_ID
- COS_BUCKET_NAME
- CLOUDANT_URL

### Docker and IBM Cloud Registry Setup

First, set up an IBM Cloud Registry namespace called `medbot`.

Run the following bash commands to build the Docker image and push it to the registry:

```bash
cd /path/to/your/project/docker-image
docker build --platform linux/amd64 -t us.icr.io/medbot/repo:amd .
ibmcloud login --sso
ibmcloud cr login --client docker
docker push us.icr.io/medbot/repo:amd
```

### Code Engine Deployment

Under configuration, reference the Docker image from ICR.
- Create a registry secret using an IAM API key.
- Set minimum instances to 1.
- Input environment variables.

Use the public domain mapping:
```
https://medbot-llm-search.1gpmytaegikv.us-south.codeengine.appdomain.cloud
```
in your OpenAPI spec.

### Watsonx Assistant Setup

- Import the Med Bot's actions using "med-bot-action-v7.json" in the root directory

- Set up the Watsonx Assistant custom extension using the OpenAPI for the two required actions.

- Embed WA into a page component. We can copy-paste the code from "Web chat" under Integrations.

## Next.js Deployment

To deploy your Next.js app, follow the instructions in the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.