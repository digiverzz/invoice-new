---
description: >-
  Document Search is the Feature included in this app which contains user
  uploaded documents and meanwhile using this we can search the document by
  content in the document itself.
---

# Document Search

### **Content-Based Document Search with Elastic Search**&#x20;

**Introduction**&#x20;

This documentation provides a comprehensive guide on setting up a content-based document search system using Elastic Search. The system allows users to search for specific information within PDFs, images, and text files efficiently. By leveraging the power of Elastic Search, a popular open-source search engine, you can perform fast and accurate searches on vast amounts of data.&#x20;

&#x20;

**1. Requirements**&#x20;

To implement the content-based document search system, you need to ensure that your hardware and software meet the following requirements:&#x20;

&#x20;

**2. Hardware Requirements**&#x20;

\- Sufficient disk space to store the indexed documents.&#x20;

\- Adequate memory to handle indexing and searching operations efficiently.&#x20;

\- Suggested: Multi-core processor to enhance indexing and search performance.&#x20;

&#x20;

**3. Software Requirements**&#x20;

\- Elastic Search: Install the latest version of Elastic Search, which can be downloaded from the official Elastic website (https://www.elastic.co/downloads/elasticsearch).&#x20;

\- Programming Language: Python 3.8 or 3.7 (stable version)&#x20;

&#x20;

**4. Installation**&#x20;

This section provides step-by-step instructions on installing Elastic Search with docker.&#x20;

**Reference:** [https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)&#x20;

Step 1:  Pull the Elasticsearch Docker image&#x20;

Obtaining Elasticsearch for Docker is as simple as issuing a docker pull command against the Elastic Docker registry.&#x20;

docker pull docker.elastic.co/elasticsearch/elasticsearch:8.8.0&#x20;

step 2: Create docker network for Elasticsearch&#x20;

docker network create elastic&#x20;

step 3: Start Elasticsearch in Docker&#x20;

`docker run --name es01 --net elastic -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.8.0`&#x20;

Once you have completed the previous three steps, you can retrieve the password for Elastic Search by checking the container log. Follow the instructions below to locate the password and store it in an environment file located inside the backend folder:&#x20;

&#x20;

1\. Open the container log for Elastic Search, which contains important information and messages related to its setup and initialization.&#x20;

2\. Look for the log entry that provides the password for accessing Elastic Search. It is usually displayed during the container startup process or in a dedicated log section.&#x20;

3\. Note down the password or copy it to your clipboard.&#x20;

4\. Navigate to the backend folder in your project directory.&#x20;

5\. Locate the environment file (commonly named \`.env\` or \`env\`) inside the backend folder.&#x20;

6\. Open the environment file using a text editor.&#x20;

7\. Find the variable responsible for storing the Elastic Search password, usually named \`elastic\_password\` or something similar.&#x20;

8\. Replace the placeholder value with the actual password you obtained from the container log.&#x20;

9\. Save the changes to the environment file.&#x20;

By following these steps, you will have successfully retrieved the Elastic Search password from the container log and updated the environment file within the backend folder with the correct password for accessing Elastic Search.&#x20;

&#x20;
