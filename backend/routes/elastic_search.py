
#by rk

from fastapi import APIRouter,Request,HTTPException,status

from datetime import datetime

from creds import es
import usables

router = APIRouter(
    prefix='/elastic'
)


@router.post('/upload')
async def upload(request: Request):
    data = await request.json()


    if not (data.get('filename',False) and data.get('size',False) and data.get('dataurl',False) and data.get('username',False)):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="provide both field and order key")

    username = data['username']
    
    if not usables.IsValidUser(username):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    indexname = usables.getIndex(username)

    res = []
    for fname,size,url in zip(data['filename'],data['size'],data['dataurl']):
        # print(fname)
        format = {
            "username":username,
            "filename":fname,
            "size":size,
            "datetime":datetime.now(),
            "dataurl":url
        }

        res.append(es.index(index=indexname,document=format))
        # print(res[-1])

    return {"result":res}


@router.post('/search')

async def search(request: Request):
    data = await request.json()

    
    if (data.get('query',None) == None) or not (data.get('username',False)):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="provide query key")

    
    username = data['username']
    if not usables.IsValidUser(username):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    
    indexname = usables.getIndex(username)
    # print(data['query'])
    if not data['query']:
        return es.search(index=indexname,query={"match_all":{}})['hits']['hits']

    query = {
        "query_string":{
        "query":f"*{data['query']}*",
        "fields":["filename"]
    }
    }
    result = es.search(index=indexname,query=query)['hits']['hits']

    return result

@router.post('/getallfiles')

async def getall(request: Request):

    data = await request.json()

    
    if not (data.get('username',False)):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="provide username key")

    
    username = data['username']
    if not usables.IsValidUser(username):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    
    indexname = usables.getIndex(username)
    res = es.search(index=indexname,query={"match_all":{}})['hits']['hits']
    

    # async def filestream(res):
    #     for i in res:
    #         js = {"filename":i["_source"]['filename'],"dataurl":i["_source"]['dataurl']}
    #         yield json.dumps(js).encode("utf-8")+b"\n"


    # # response = [ for i in res if i]

    # return StreamingResponse(filestream(res), media_type="application/json")

    return res


@router.post('/sort')
async def sort(request:Request):
    data = await request.json()

    if not (data.get('field',False) and data.get('order',False) and data.get('username',False)):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="provide field,order,username key")

    
    username = data['username']
    if not usables.IsValidUser(username):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    
    indexname = usables.getIndex(username)


    query={f"{data['field']}":{"order":{data['order']}}}

    return es.search(index=indexname,sort=query)['hits']['hits'] 


    
