#by rk
from elasticsearch import Elasticsearch

from pymongo import MongoClient
es = Elasticsearch(["https://localhost:9200"],basic_auth=("elastic","StG_wbro*q_QM8a9wuIS"),verify_certs=False)




#mongo db
uri = "mongodb+srv://digiverz:digiverz@cluster0.ngqcelw.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
database = client['invoice']
collection = database['users']