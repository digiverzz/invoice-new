#by rk
from elasticsearch import Elasticsearch
import imaplib

import email
from pymongo import MongoClient
es = Elasticsearch(["http://172.174.180.163:9200"],basic_auth=("elastic","XybmMIjhmvO1VsOPSx6U"),verify_certs=False)




#mongo db
uri = "mongodb+srv://digiverz:digiverz@cluster0.ngqcelw.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
database = client['invoice']
collection = database['users']


mail = imaplib.IMAP4_SSL("imap.gmail.com",993)

mail.login("digiverzinvoiceclaim@gmail.com","wvkvofuvbewbhdku")

mail.select('Inbox')