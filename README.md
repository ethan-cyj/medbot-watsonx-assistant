This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Running the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployed Usage
A QR code cam be generated to open the following url:
https://medbot-watsonx-assistant.vercel.app/?patient_id=1&visit_id=1, where patient_id and visit_id are variable.
 
We take in patient_id and visit_id, which is passed into watsonAssistantChatOptions in order to initialise the WA with the corresponding session variables. 

These are then used to retrieve the rest of the patient's information (from Cloudant DB)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Docker Image

Components:
- documents: contains some txt files about certain medical and admin information taken from TTSH Hospital website
- indexing.ipynb
    - preprocessing of hospital documents
    - insertion of documents into COS bucket
    - set up and ingestion of documents from COS into elasticsearch index
    - creation of Cloudant DB and insertion of dummy patient info.
- cloudant.py
    - initialisation of Cloudant client
    - query_patient_info() retrieves patient info based on visit_id and patient_id
- llm.py
    - initialises MedBot instance
    - builds prompt based on provided inputs and based on query intent given by WA
    - generate_response() returns a response generated from llama-3-70b-instruct model, via watsonx.ai
- search.py
    - initialises elasticsearch client
    - provices handle_search() which MedBot instance uses for a semantic search (ELSER) of hospital documents.
- app.py
    - flask app that provides the following POST endpoints that we use in our OpenAPI specification:
    - /generate_response
    - /get_patient
    - see openapi.yaml for the OpenAPI spec.

## Set Up:
Prerequisites to provision:
- watsonx.ai
- watsonx discovery (an Elasticsearch account)
- ibm cloud registry: I use the free tier 
- ibm Code Engine
- Watsonx Assistant

first, need to set up ibm cloud registry namespace called medbot

run the following bash commands to build docker image and push it to the registry:

cd /path/to/your/project/docker-image
docker build --platform linux/amd64 -t us.icr.io/medbot/repo:amd .
ibmcloud login --sso
ibmcloud cr login --client docker
docker push us.icr.io/medbot/repo:amd

next, deploy a Code Engine project
- under configuration, reference the docker image from icr
- create a registry secret using (IAM API key)
- set min. instances to 1
- input env variables

we can then use the public domain mapping: https://medbot-llm-search.1gpmytaegikv.us-south.codeengine.appdomain.cloud in our OpenAPI spec.

Lastly, set up the WA custom extension using the OpenAPI for the two required actions. 