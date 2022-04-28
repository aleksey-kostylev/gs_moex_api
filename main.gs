// Функция для загрузки котировок по инструменту за выбранный период:
// параметр stocks может принимать такие значения как 'shares' (акции) или 'bonds' (облигации, ОФЗ)
// параметр board может принимать разные значения: для акций ('TQBR', 'SMAL', 'EQDP', 'TQDE') или для облигаций ('AUCT', 'TQOB', 'TQDB', 'EQOB', 'PSOB', 'RPMO')
// параметр ticker - это код ценной бумаги (например 'SBER')
// параметр start_date - дата начала периода выгрузки
// параметр end_date - дата окончания выгрузки
// параметр date - разница в днях между end_date и start_date (можно посчитать в самих google таблицах просто указав даты в ячейках и найдя разницу)

// Пример использования функции без ссылок на ячейки:
// quotes('shares', 'TQBR', 'SBER', '2022-01-01', '2022-04-01')
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
  
// Функция для расчета среднего оборота за выбранный период:
// параметр stocks может принимать такие значения как 'shares' (акции) или 'bonds' (облигации, ОФЗ)
// параметр board может принимать разные значения: для акций ('TQBR', 'SMAL', 'EQDP', 'TQDE') или для облигаций ('AUCT', 'TQOB', 'TQDB', 'EQOB', 'PSOB', 'RPMO')
// параметр ticker - это код ценной бумаги (например 'SBER')
// параметр start_date - дата начала периода выгрузки
// параметр end_date - дата окончания выгрузки
// параметр date - разница в днях между end_date и start_date (можно посчитать в самих google таблицах просто указав даты в ячейках и найдя разницу)

// Пример использования функции без ссылок на ячейки:
// quotes('shares', 'TQBR', 'SBER', '2022-01-01', '2022-04-01')
// Выдаст одно значение - среднедневной оборот за выбранный период.

function average_value(stocks, board, ticker, start_date, end_date, days){
  var url = `https:\/\/iss.moex.com/iss/history/engines/stock/markets/${stocks}\/boards/${board}\/securities/${ticker}.json?from=${start_date}&till=${end_date}`;
  var response = UrlFetchApp.fetch(url);
  var content = response.getContentText();
  var data = JSON.parse(content)["history"];
 
  var table = [] // создаем header
  
  for(var row = 0; row < data['data'].length; row++){
    table = table.concat([[data['data'][row][5]]])
  }
  
  var sum = table.reduce(function(a, b){
    a = removeComma(a)
    b = removeComma(b)
    return a + b;
  }, 0)
  
  
  return sum/days
}

// Вспомогательная функция для того чтобы заменить запяную на точку и корректно сложить массив из чисел (используем в функции average_value).
function remove_comma(value){
  var remComma = value.toString();
  value = remComma.replace(/,/g,'');
  value = parseFloat(value)
return value;
};

// Функция, которая выгружает все инструменты с выбранного борда:
// параметр stocks может принимать такие значения как 'shares' (акции) или 'bonds' (облигации, ОФЗ)
// параметр board может принимать разные значения: для акций ('TQBR', 'SMAL', 'EQDP', 'TQDE') или для облигаций ('AUCT', 'TQOB', 'TQDB', 'EQOB', 'PSOB', 'RPMO')

// Пример использования функции без ссылок на ячейки:
// securities('shares', 'TQBR')
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