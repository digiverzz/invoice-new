#by rk
import creds

def IsValidUser(name):
    if creds.collection.find_one({"name":name}):
        return True
    return False


def getIndex(name):
    if not creds.es.indices.exists(index=name):
        creds.es.indices.create(index=name)
    return name


