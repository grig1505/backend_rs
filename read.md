
Задачи:
Написать функционал по удалению заметки по переданному ID
При выводе списка элементов командой list выводить так же ID заметки
Вам необходимо:
Добавить новую команду remove, которая будет удалять заметку по ID.

Команда принимает один параметр —-id
Команды:
index add  Add new note to list
index list   Print all notes
index remove Remove note by id
Изменить логику команды list, чтобы при выводе заметок также выводился её ID.

Результат команды node index list:
Here is the list of notes:
1634833738358 Hello


консольные команды:
Добавить: node index add --title="Hello"
Список: node index list
Удалить по ID: node index remove --id=1634833738358