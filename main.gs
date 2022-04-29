// Функция для загрузки котировок по инструменту за выбранный период:
// параметр stocks может принимать такие значения как 'shares' (акции) или 'bonds' (облигации, ОФЗ)
// параметр board может принимать разные значения: для акций ('TQBR', 'SMAL', 'EQDP', 'TQDE') или для облигаций ('AUCT', 'TQOB', 'TQDB', 'EQOB', 'PSOB', 'RPMO')
// параметр ticker - это код ценной бумаги (например 'SBER')
// параметр start_date - дата начала периода выгрузки в формате ГГГГ-ММ-ДД
// параметр end_date - дата окончания выгрузки в формате ГГГГ-ММ-ДД

// Пример использования функции без ссылок на ячейки:
// quotes("shares"; "TQBR"; "SBER"; "2022-01-01"; "2022-04-01")
// Выдаст массив с данным (лучше ставить в ячейку A1)

function quotes(stocks, board, ticker, start_date, end_date){
  var url = `https:\/\/iss.moex.com/iss/history/engines/stock/markets/${stocks}\/boards/${board}\/securities/${ticker}.json?from=${start_date}&till=${end_date}`;
  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText();
  var data = JSON.parse(content)["history"];
  
  var table = [data['columns']]
  
  for(var row = 0; row < data['data'].length; row++){
    table = table.concat([data['data'][row]])
  }
  
  return table
  
}
  
// Функция для расчета среднего оборота (в деньгах) за выбранный период:
// параметр stocks может принимать такие значения как 'shares' (акции) или 'bonds' (облигации, ОФЗ)
// параметр board может принимать разные значения: для акций ('TQBR', 'SMAL', 'EQDP', 'TQDE') или для облигаций ('AUCT', 'TQOB', 'TQDB', 'EQOB', 'PSOB', 'RPMO')
// параметр ticker - это код ценной бумаги (например 'SBER')
// параметр start_date - дата начала периода выгрузки в формате ГГГГ-ММ-ДД
// параметр end_date - дата окончания выгрузки в формате ГГГГ-ММ-ДД

// Пример использования функции без ссылок на ячейки:
// average_value("shares"; "TQBR"; "SBER"; "2022-01-01"; "2022-04-01", 100)
// Выдаст одно значение - среднедневной оборот за выбранный период.

function average_value(stocks, board, ticker, start_date, end_date){
  var url = `https:\/\/iss.moex.com/iss/history/engines/stock/markets/${stocks}\/boards/${board}\/securities/${ticker}.json?from=${start_date}&till=${end_date}`;
  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText();
  var data = JSON.parse(content)["history"];

  var table = []
  
  for(var row = 0; row < data['data'].length; row++){
    table = table.concat([[data['data'][row][5]]])
  }
  
  var sum = table.reduce(function(a, b){
    a = remove_comma(a)
    b = remove_comma(b)
    return a + b;
  }, 0)
  
  var days = myCounter(data['data'])

  if (sum == 0){
    return 0
  } else {
    return sum/days
  }
}

// Вспомогательная функция для того чтобы заменить запяную на точку и корректно сложить массив из чисел (используем в функции average_value).
function remove_comma(value){
  var remComma = value.toString();
  value = remComma.replace(/,/g,'');
  value = parseFloat(value)
return value;
};

// Вспомогательная функция для подсчета кол-ва элементов в списке данных (возвращает кол-во рабочих дней в выбранном периоде)
function myCounter(arr){
  x = arr.filter(y => typeof Array() == typeof y).length
  return x
}

// Вспомогательная фунция, которая помогает найти количество рабочих дней за указанный промежуток времени
function countDays(stocks, board, ticker, start_date, end_date){
  var url = `https:\/\/iss.moex.com/iss/history/engines/stock/markets/${stocks}\/boards/${board}\/securities/${ticker}.json?from=${start_date}&till=${end_date}`;
  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText();
  var data = JSON.parse(content)["history"];
  var days = myCounter(data['data'])

  return days
}

// Функция, которая выгружает все инструменты с выбранного борда:
// параметр stocks может принимать такие значения как 'shares' (акции) или 'bonds' (облигации, ОФЗ)
// параметр board может принимать разные значения: для акций ('TQBR', 'SMAL', 'EQDP', 'TQDE') или для облигаций ('AUCT', 'TQOB', 'TQDB', 'EQOB', 'PSOB', 'RPMO')

// Пример использования функции без ссылок на ячейки:
// securities("shares"; "TQBR")
// Выдаст массив с данным (лучше ставить в ячейку A1)

function securities(stocks, board){
  var url = `https:\/\/iss.moex.com/iss/engines/stock/markets/${stocks}\/boards/${board}\/securities.json`;
  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText();
  var data = JSON.parse(content)["securities"];
  
  var table = [data['columns']]
  
  for(var row = 0; row < data['data'].length; row++){
    table = table.concat([data['data'][row]])
  }
  
  return table
  
}
