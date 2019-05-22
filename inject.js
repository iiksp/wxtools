// this is the code which will be injected into a given page...

llog = console.log

record_room = getRoom('➕学')
last_save_msg = ''

datalist=[]
tmpchatlog=[]

function getRoom(room_name)
{
	room = document.getElementsByClassName('box_bd chat_bd scrollbar-dynamic scroll-content')[0]
	room_chat_box = room.getElementsByClassName('ng-scope')[0]
	return room_chat_box
}

function getMsgL()
{
	return Array.from(record_room.getElementsByClassName('message ng-scope you'))
	//return Array.from(record_room.getElementsByClassName('js_message_plain ng-binding'))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


lasttxd=''
lastev=1

function testMsgget (ev)
{
	if(lastev != ev.target)
	{
		lastev=ev.target
		msgl = getMsgL()
		
		m = msgl[msgl.length - 1]
		
		if(m)
		{
			try
			{		
				user = m.getElementsByTagName('img')[0].getAttribute('title')
				m = m.getElementsByClassName('js_message_plain ng-binding')[0]
				
				
				if(m.textContent && m.textContent.length > 0)
				{
					
					content = user+":"+m.textContent
					
					if(content != lasttxd )
					{
						lasttxd = content
						
						content = new Date().toLocaleString() + " " + content
						llog(content + '    '+ datalist.push(content))
						
						if((datalist.length % 50) == 0)
						{
							
							// chrome.storage.local.set({'chatlog':datalist})
							
							chrome.storage.local.get(['chatlog'],
							function(res)
							{
								tmpchatlog = res.chatlog
							})
							
							llog('---------------------------------save log----------------' + tmpchatlog.push(...datalist))
							chrome.storage.local.set({'chatlog':tmpchatlog})
							datalist=[]
						}
					}
				}
			}
			catch(err)
			{
				llog(m)
			}
		}
		
		
		// msgl.forEach(function(m)
		// {
			// if(m.textContent != lasttxd && m.textContent.length > 0)
			// {
				
				// llog(m.textContent + '    ' + lasttxd)
				// lasttxd = m.textContent
			// }
		// }
		// )
	}
}

(function() {

	// just place a div at top right
	var div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.textContent = 'Injected!';
	document.body.appendChild(div);

	alert('inserted self... giggity');
	getRoom().addEventListener('DOMNodeInserted', testMsgget)
})();