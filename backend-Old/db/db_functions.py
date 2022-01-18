import psycopg2
import hashlib
from db.db_config import host, user, db_name, password


def signup(login, password):
    result = False
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM public.user WHERE name=%s;", (login,))
            connection.commit()
            # print(len(cursor.fetchone()))
            if (cursor.fetchone()[0] == 0):
                print(cursor.fetchone())
                cursor.execute('INSERT INTO public.user (name, password) VALUES(%s, %s)',
                               (login, hashlib.md5(password.encode()).hexdigest()))
                connection.commit()
                result = True

    except Exception as ex:
        print('[DB Error] Signup Exception:', ex)
    finally:
        return result


def signin(login, password):
    result = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM public.user WHERE name=%s AND password=%s;",
                           (login, hashlib.md5(password.encode()).hexdigest()))
            connection.commit()

            if (cursor.fetchone()[0] > 0):
                result = True
    except Exception as ex:
        print('[DB Error] Signin Exception:', ex)
    finally:
        return result


def getAllMessages():
    result = []
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT public.messages.text, public.user.name FROM public.messages
                                    INNER JOIN public.user
                                    ON public.user.id=public.messages.owner ORDER BY public.messages.id""")
            connection.commit()
            # print(cursor.fetchall())
            for line in cursor.fetchall():
                message = {}
                message["text"] = line[0]
                message["author"] = line[1]
                result.append(message)
    except Exception as ex:
        print('[DB Error] getAllMessages Exception:', ex)
    finally:
        return result


def pushMessage(text, author):
    result = False
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id FROM public.user WHERE name=%s", (author,))
            connection.commit()
            authorId = 0
            resp = cursor.fetchone()
            if (not resp is None):
                authorId = resp[0]
                cursor.execute("INSERT INTO public.messages \
                                    (text, owner) \
                                    VALUES (%s, %s)", (text, authorId))
                connection.commit()
                result = True
    except Exception as ex:
        print('[DB Error] pushMessages Exception:', ex)
    finally:
        return result


def removeUser(login):
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM public.user WHERE name=%s;", (login,))
            connection.commit()
    except Exception as ex:
        print('[DB Error] Signup Exception:', ex)


def getAllUsers():
    result = []
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT name FROM public.user WHERE id!=1""")
            connection.commit()
            # print(cursor.fetchall())
            for line in cursor.fetchall():
                message = {}
                message["login"] = line[0]
                result.append(message)
    except Exception as ex:
        print('[DB Error] getAllUsers Exception:', ex)
    finally:
        return result


def getDialog(login_from, login_to):
    result = []
    try:
        id_from = ""
        id_to = ""
        dict = {}
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id FROM public.user WHERE name=%s", (login_from,))
            connection.commit()
            # print(cursor.fetchall())

            for line in cursor.fetchall():
                id_from = line[0]
                dict[id_from] = login_from
            cursor.execute(
                "SELECT id FROM public.user WHERE name=%s", (login_to,))
            connection.commit()
            for line in cursor.fetchall():
                id_to = line[0]
                dict[id_to] = login_to

            messages = []
            authors = []
            cursor.execute("SELECT text FROM public.messages_private WHERE (id_from='%s' AND id_to='%s') OR (id_from='%s' AND id_to='%s')",
                           (id_from, id_to, id_to, id_from))
            connection.commit()
            for line in cursor.fetchall():
                messages.append({"message": line[0]})

            cursor.execute("SELECT id_from FROM public.messages_private WHERE (id_from='%s' AND id_to='%s') OR (id_from='%s' AND id_to='%s')",
                           (id_from, id_to, id_to, id_from))
            connection.commit()
            for line in cursor.fetchall():
                authors.append({'author': dict.get(line[0])})

            result.append({'messages': messages, 'authors': authors})
            print(result)
    except Exception as ex:
        print('[DB Error] getDialog Exception:', ex)
    finally:
        return result


def pushPrivateMessage(text, login_from, login_to):
    result = False
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id FROM public.user WHERE name=%s", (login_from,))
            connection.commit()
            # print(cursor.fetchall())
            id_from = ""
            id_to = ""

            for line in cursor.fetchall():
                id_from = line[0]
            cursor.execute(
                "SELECT id FROM public.user WHERE name=%s", (login_to,))
            connection.commit()
            for line in cursor.fetchall():
                id_to = line[0]
            cursor.execute(
                "INSERT INTO public.messages_private (id_from, id_to, text) VALUES (%s, %s, %s)", (id_from, id_to, text))
            connection.commit()
            result = True
    except Exception as ex:
        print('[DB Error] pushPrivateMessage Exception:', ex)
    finally:
        return result


try:
    connection = psycopg2.connect(
        host=host, user=user, password=password, database=db_name)
except Exception as ex:
    print('[DB Error] Connect exception:', ex)
