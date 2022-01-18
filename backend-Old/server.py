import socket
import threading
import db.db_functions as db_functions
import json

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('127.0.0.1', 55000))
server.listen(4)


def listener(client_socket):
    print('new listener')
    try:
        while(True):
            if (client_socket):
                data = client_socket.recv(1024).decode('utf-8')
                if (data):
                    queryType = json.loads(data)['type']
                    print(queryType)
                    data = json.loads(data)
                    result = False
                    response = None
                    if (queryType == 'signin'):
                        result = db_functions.signin(
                            data['login'], data['password'])
                        response = {'type': queryType,
                                    'result': result, 'login': data['login']}

                    if (queryType == 'signup'):
                        result = db_functions.signup(
                            data['login'], data['password'])
                        response = {'type': queryType, 'result': result}

                    if (queryType == 'start'):
                        result = db_functions.getAllMessages()
                        users = db_functions.getAllUsers()
                        response = {'type': 'start',
                                    'result': result, 'users': users}

                    if (queryType == 'newmessage'):
                        result = db_functions.pushMessage(
                            data['text'], data['author'])
                        messageSender(data['text'], data['author'])
                        result = True

                    if (queryType == 'remove'):
                        db_functions.removeUser(data['login'])
                        response = None

                    if (queryType == 'end'):
                        response = None
                        clients.remove(client_socket)
                        print('client disconnected')

                    if (queryType == 'getDialogs'):
                        result = db_functions.getDialog(
                            data['from'], data['to'])
                        response = {'type': queryType, 'result': result}

                    if (queryType == 'newPrivateMessage'):
                        result = db_functions.pushPrivateMessage(
                            data['text'], data['from'], data['to'])
                        privateMessageSender(
                            data['text'], data['from'], data['to'])
                        result = True

                    if (not response is None):
                        client_socket.send(json.dumps(
                            response).encode('utf-8'))

    except Exception as ex:
        print('[Server Error]:', ex)
        clientsMut.acquire()
        clients.remove(client_socket)
        clientsMut.release()
        return -1


print('Ready...')

clients = []
clientsMut = threading.Lock()


def messageSender(text, author):
    clientsMut.acquire()
    response = {'type': 'newmessage', 'result': {
        'text': text, 'author': author}}
    for client in clients:
        client.send(json.dumps(response).encode('utf-8'))

    clientsMut.release()


def privateMessageSender(text, login_from, login_to):
    clientsMut.acquire()
    response = {'type': 'newPrivateMessage', 'result': {
        'text': text, 'from': login_from, 'to': login_to}}
    for client in clients:
        client.send(json.dumps(response).encode('utf-8'))

    clientsMut.release()


while(True):
    client_socket, address = server.accept()

    clientsMut.acquire()
    clients.append(client_socket)
    clientsMut.release()
    threading.Thread(target=listener, args=(client_socket,)).start()
