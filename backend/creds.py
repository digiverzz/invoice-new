#by rk
from elasticsearch import Elasticsearch
import imaplib

import email
from pymongo import MongoClient
es = Elasticsearch(["https://localhost:9200"],basic_auth=("elastic","854bgbrEznFOZOJrE_hj"),verify_certs=False)




#mongo db
uri = "mongodb+srv://digiverz:digiverz@cluster0.ngqcelw.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
database = client['invoice']
collection = database['users']


mail = imaplib.IMAP4_SSL("imap.gmail.com",993)

mail.login("digiverzinvoiceclaim@gmail.com","wvkvofuvbewbhdku")

mail.select('Inbox')