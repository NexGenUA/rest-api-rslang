# LearnWords
A backend part of [Front-End Stage#2 RS.School task](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/rslang/rslang.md)

#### [Deployed project](https://api-rslang.herokuapp.com/)  
#### [Swagger docs](https://api-rslang.herokuapp.com/doc/#)

## Примеры получения исходных данных

Для этого создан REST API по адресу: https://api-rslang.herokuapp.com/

Для тестирования API можно пользоваться Swagger докой по адресу: https://api-rslang.herokuapp.com/doc/#/

Описание эндпоинтов(не полное, смотри Swagger Doc):

### Words

GET для получения списка слов:
`https://api-rslang.herokuapp.com/words?page=2&group=0` - получить слова со 2-й страницы группы 0  
Строка запроса должна содержать в себе номер группы и номер страницы. Всего 6 групп(от 0 до 5) и в каждой группе по 30 страниц(от 0 до 29). В каждой странице по 20 слов. Группы разбиты по сложности от самой простой(0) до самой сложной(5).

### Users

Система поддерживает разграничение данных по пользователям, в рамках данной задачи вам понадобится создать форму для регистрации пользователя. Для этого надо использовать POST эндпоинт по адресу `/users`. В запросе надо передать JSON объект, который содержит e-mail и password пользователя. Пароль должен содержать не менее 8 символов, как минимум одну прописную букву, одну заглавную букву, одну цифру и один спецсимвол из `+-_@$!%*?&#.,;:[]{}`. Пример запроса:  
```javascript
const createUser = async user => {
     const rawResponse = await fetch('https://api-rslang.herokuapp.com/users', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(user)
     });
     const content = await rawResponse.json();
   
     console.log(content);
   };

createUser({ "email": "hello@user.com", "password": "Gfhjkm_123" });
-------------------------------------------------------------------
Console: {
  id: "5ec993df4ca9d600178740ae", 
  email: "hello@user.com"
}
```

### Sign In

Чтобы пользоваться эндпоинтами требующими авторизации необходимо залогиниться в систему и получить JWT токен. Для этого существует POST эндоинт по адресу `/signin`. Токены имеют ограниченный срок жизни, в текущей реализации это 4 часа с момента получения. Пример запроса:  
```javascript
const loginUser = async user => {
  const rawResponse = await fetch('https://api-rslang.herokuapp.com/signin', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  const content = await rawResponse.json();

  console.log(content);
};

loginUser({ "email": "hello@user.com", "password": "Gfhjkm_123" });
-------------------------------------------------------------------
Console: 
{
  "message":"Authenticated",
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzk5M2RmNGNhOWQ2MDAxNzg3NDBhZSIsImlhdCI6MTU5MDI2OTE1OCwiZXhwIjoxNTkwMjgzNTU4fQ.XHKmdY_jk1R7PUbgCZfqH8TxH6XQ0USwPBSKNHMdF6I",
  "userId":"5ec993df4ca9d600178740ae"
}
```

### Users/Words

Полученный при успешном логине токен надо использовать при каждом запросе к эндпоинтам требующим авторизации (в Swagger такие эндпоинты имеют иконку навесного замка. При работе со Swagger полученный токен надо вставить в соответствующее поле формы, которая появляется при нажатии на кнопку `Authorize` вверху страницы справа). Примеры запросов:    
```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzk5M2RmNGNhOWQ2MDAxNzg3NDBhZSIsImlhdCI6MTU5MDI2OTE1OCwiZXhwIjoxNTkwMjgzNTU4fQ.XHKmdY_jk1R7PUbgCZfqH8TxH6XQ0USwPBSKNHMdF6I';
const createUserWord = async ({ userId, wordId, word }) => {
  const rawResponse = await fetch(`https://api-rslang.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await rawResponse.json();

  console.log(content);
};

createUserWord({
  userId: "5ec993df4ca9d600178740ae",
  wordId: "5e9f5ee35eb9e72bc21af716",
  word: { "difficulty": "weak", "optional": {testFieldString: 'test', testFieldBoolean: true} }
});
-------------------------------------------------------------------
Console: {
  "id":"5ec9a92acbbd77001736b167",
  "difficulty":"weak",
  "optional":{
    "testFieldString":"test",
    "testFieldBoolean":true
  },
  "wordId":"5e9f5ee35eb9e72bc21af716"
}

const getUserWord = async ({ userId, wordId }) => {
  const rawResponse = await fetch(`https://api-rslang.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  const content = await rawResponse.json();

  console.log(content);
};

getUserWord({
  userId: "5ec993df4ca9d600178740ae",
  wordId: "5e9f5ee35eb9e72bc21af716"
});
-------------------------------------------------------------------
Console: {
  "id":"5ec9a92acbbd77001736b167",
  "difficulty":"weak",
  "optional":{
    "testFieldString":"test",
    "testFieldBoolean":true
  },
  "wordId":"5e9f5ee35eb9e72bc21af716"
}
```
Также существуют эндпоинты для сохранения статистики и настроек пользователя. `\users\{id}\statistics` и `\users\{id}\settings` соответственно. Работа с ними основывается на тех же принципах, что описаны и показаны в примерах выше.  
Объект `optional` у UserWord, Statistics, Settings имеет ограничение по размеру - не более 30 полей и общая длина объекта после `JSON.stringify()` не должна превышать 1500 символов. Структуру этих объектов вы разрабатываете сами исходя из требований и вашей реализации задачи.   

### UserData

Получение кастомной статистики пользователя, содержит 3 поля:


```javascript
  lerningWords:	[string]
  hardWords:	[string]
  deletedWords:	[string]
```

**Пример получения данных**

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYzk5M2RmNGNhOWQ2MDAxNzg3NDBhZSIsImlhdCI6MTU5MDI2OTE1OCwiZXhwIjoxNTkwMjgzNTU4fQ.XHKmdY_jk1R7PUbgCZfqH8TxH6XQ0USwPBSKNHMdF6I';

const createUserWord = async (userId) => {
  const response = await fetch(`https://api-rslang.herokuapp.com/users/${userId}/user-data`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });

  const userData = await response.json();

  console.log(userData);
};
```


**Пример обновления данных**

- Нужно передавать все поля, даже те, которые не были обновлены, данные полностью заменятся на то, что мы передадим

```javascript
updateData = {
  lerningWords:	['wordId-1', 'wordId-3', 'wordId-7'],
  hardWords:	['wordId-11', 'wordId-21', 'wordId-32'],
  deletedWords:	['wordId-55', 'wordId-63', 'wordId-100']
}

const createUserWord = async (userId) => {
  const response = await fetch(`https://api-rslang.herokuapp.com/users/${userId}/user-data`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  const userData = await response.json();

  console.log(userData);
}
```

### Users/AggregatedWords

Данные эндпоинты позволяют получить список слов(или одно слово) объединенный с существующими данными в userWords. Например,  в БД существуют userWords следующего вида:
```json
[
  {
    "id": "5ee9d0709045590017eb504b",
    "difficulty": "weak",
    "optional": {
      "testFieldString": "test",
      "testFieldBoolean": true
    },
    "wordId": "5e9f5ee35eb9e72bc21af716"
  },
  {
    "id": "5eebcde0d3f9e856e68e74e7",
    "difficulty": "easy",
    "optional": {
      "field": "value1"
    },
    "wordId": "5e9f5ee35eb9e72bc21af4a1"
  },
  {
    "id": "5eee2d5d3b0620240caa89e1",
    "difficulty": "strong",
    "wordId": "5e9f5ee35eb9e72bc21af4a0"
  }
]
```
Запрос к `/users/{id}/aggregatedWords` со следующими параметрами:

```
userId: 5ec8942878c1e84b43e871ac
group: 0
wordsPerPage: 3
filter: {
"userWord.difficulty":"strong"
}
onlyUserWords: false
```

<details> 
  <summary>должен вернуть такой ответ:</summary>

  <p></p>

```json
[
  {
    "paginatedResults": [
      {
        "_id": "5e9f5ee35eb9e72bc21af4a0",
        "group": 0,
        "page": 0,
        "word": "alcohol",
        "image": "files/01_0002.jpg",
        "audio": "files/01_0002.mp3",
        "audioMeaning": "files/01_0002_meaning.mp3",
        "audioExample": "files/01_0002_example.mp3",
        "textMeaning": "<i>Alcohol</i> is a type of drink that can make people drunk.",
        "textExample": "A person should not drive a car after he or she has been drinking <b>alcohol</b>.",
        "transcription": "[ǽlkəhɔ̀ːl]",
        "textExampleTranslate": "Человек не должен водить машину после того, как он выпил алкоголь",
        "textMeaningTranslate": "Алкоголь - это тип напитка, который может сделать людей пьяными",
        "wordTranslate": "алкоголь",
        "wordsPerExampleSentence": 15,
        "userWord": {
          "difficulty": "strong"
        }
      },
      {
        "_id": "5e9f5ee35eb9e72bc21af4a2",
        "group": 0,
        "page": 0,
        "word": "boat",
        "image": "files/01_0005.jpg",
        "audio": "files/01_0005.mp3",
        "audioMeaning": "files/01_0005_meaning.mp3",
        "audioExample": "files/01_0005_example.mp3",
        "textMeaning": "A <i>boat</i> is a vehicle that moves across water.",
        "textExample": "There is a small <b>boat</b> on the lake.",
        "transcription": "[bout]",
        "textExampleTranslate": "На озере есть маленькая лодка",
        "textMeaningTranslate": "Лодка - это транспортное средство, которое движется по воде",
        "wordTranslate": "лодка",
        "wordsPerExampleSentence": 8
      },
      {
        "_id": "5e9f5ee35eb9e72bc21af4a3",
        "group": 0,
        "page": 0,
        "word": "arrive",
        "image": "files/01_0003.jpg",
        "audio": "files/01_0003.mp3",
        "audioMeaning": "files/01_0003_meaning.mp3",
        "audioExample": "files/01_0003_example.mp3",
        "textMeaning": "To <i>arrive</i> is to get somewhere.",
        "textExample": "They <b>arrived</b> at school at 7 a.m.",
        "transcription": "[əráiv]",
        "textExampleTranslate": "Они прибыли в школу в 7 часов утра",
        "textMeaningTranslate": "Приехать значит попасть куда-то",
        "wordTranslate": "прибыть",
        "wordsPerExampleSentence": 7
      }
    ],
    "totalCount": [
      {
        "count": 599
      }
    ]
  }
]
```

</details> 
 - поле `paginatedResults` это результат агрегации `Words & UserWords` с учетом заданных параметров запроса и фильтра.    
 - поле `totalCount` показывает сколько всего существует слов в данной группе соответствующих данному фильтру.  

Пример запроса к `/users/{id}/aggregatedWords` с более сложным фильтром: 
 
```
userId: 5ec8942878c1e84b43e871ac
group: 0
wordsPerPage: 3
filter: {
  "$and": [
    {
      "$or": [
        {
          "userWord.difficulty": "strong"
        },
        {
          "userWord.difficulty": "easy"
        }
      ]
    }
  ]
}

onlyUserWords: false
```

<details> 
  <summary>должен вернуть такой ответ:</summary>

  <p></p>

```json
	
Response body
Download
[
  {
    "paginatedResults": [
      {
        "_id": "5e9f5ee35eb9e72bc21af4a0",
        "group": 0,
        "page": 0,
        "word": "alcohol",
        "image": "files/01_0002.jpg",
        "audio": "files/01_0002.mp3",
        "audioMeaning": "files/01_0002_meaning.mp3",
        "audioExample": "files/01_0002_example.mp3",
        "textMeaning": "<i>Alcohol</i> is a type of drink that can make people drunk.",
        "textExample": "A person should not drive a car after he or she has been drinking <b>alcohol</b>.",
        "transcription": "[ǽlkəhɔ̀ːl]",
        "textExampleTranslate": "Человек не должен водить машину после того, как он выпил алкоголь",
        "textMeaningTranslate": "Алкоголь - это тип напитка, который может сделать людей пьяными",
        "wordTranslate": "алкоголь",
        "wordsPerExampleSentence": 15,
        "userWord": {
          "difficulty": "strong"
        }
      },
      {
        "_id": "5e9f5ee35eb9e72bc21af4a2",
        "group": 0,
        "page": 0,
        "word": "boat",
        "image": "files/01_0005.jpg",
        "audio": "files/01_0005.mp3",
        "audioMeaning": "files/01_0005_meaning.mp3",
        "audioExample": "files/01_0005_example.mp3",
        "textMeaning": "A <i>boat</i> is a vehicle that moves across water.",
        "textExample": "There is a small <b>boat</b> on the lake.",
        "transcription": "[bout]",
        "textExampleTranslate": "На озере есть маленькая лодка",
        "textMeaningTranslate": "Лодка - это транспортное средство, которое движется по воде",
        "wordTranslate": "лодка",
        "wordsPerExampleSentence": 8
      },
      {
        "_id": "5e9f5ee35eb9e72bc21af4a1",
        "group": 0,
        "page": 0,
        "word": "agree",
        "image": "files/01_0001.jpg",
        "audio": "files/01_0001.mp3",
        "audioMeaning": "files/01_0001_meaning.mp3",
        "audioExample": "files/01_0001_example.mp3",
        "textMeaning": "To <i>agree</i> is to have the same opinion or belief as another person.",
        "textExample": "The students <b>agree</b> they have too much homework.",
        "transcription": "[əgríː]",
        "textExampleTranslate": "Студенты согласны, что у них слишком много домашней работы",
        "textMeaningTranslate": "Согласиться - значит иметь то же мнение или убеждение, что и другой человек",
        "wordTranslate": "согласна",
        "wordsPerExampleSentence": 8,
        "userWord": {
          "difficulty": "easy",
          "optional": {
            "field": "value1"
          }
        }
      }
    ],
    "totalCount": [
      {
        "count": 600
      }
    ]
  }
]
```
</details>
  
Параметр filter должен быть валидным JSON объектом преобразованным в строку. Все ключи в этом объекте должны быть в двойных кавычках. Кроме этого этот объект должен соответствовать требованиям к `MongoDB Query`. Вот ряд ссылок на документацию и примеры использования `MonogoDB Query`:  
 - [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)  
 - [Query and Projection Operators](https://docs.mongodb.com/manual/reference/operator/query/#query-and-projection-operators)  
 - [An Introduction to MongoDB Query for Beginners](https://blog.exploratory.io/an-introduction-to-mongodb-query-for-beginners-bd463319aa4c)  
 - [MongoDB - Query Document](https://www.tutorialspoint.com/mongodb/mongodb_query_document.htm)  

Для преобразования строки filter в валидный query-параметр можно использовать следующую функцию: [encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)  

В фильтре также можно обращаться к полям optional объекта userWord:  
`"userWord.optional.key":value`  

Эндпоинт `/users/{id}/aggregatedWords/{wordId}` позволяет получить агрегированый объект конкретного слова.  
