import urllib.request
import urllib.error
import json
from datetime import datetime

# https://qiita.com/podhmo/items/dc748a9d40026c28556d
def support_datetime_default(o):
	if isinstance(o, datetime):
		return o.strftime('%H:%M')
	raise TypeError(repr(o) + ' is not JSON serializable')

portNo = 3001

id = input('id? ')
name = input('name? ')
action = input('action? ')

dic = {'id': id, 'name': name, 'timestamp': datetime.now(),'action': action}

json_data = json.dumps(dic, default=support_datetime_default).encode('utf-8')
headers = {'Content-type': 'application/json'}

req = urllib.request.Request(url='http://localhost:{}/api/card_touched'.format(portNo), data=json_data, method='POST', headers=headers)

try: urllib.request.urlopen(req)
except urllib.error.URLError as e:
	print(e.reason)
