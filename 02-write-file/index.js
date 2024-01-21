const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const fileName = path.join(__dirname, 'text.txt');

fs.writeFile(fileName, '', (err) => { if (err) throw err; });

stdout.write('Введите строки\nДля выхода из приложения наберите exit\n');

//ждем ввод данных
stdin.on('data', (data) => {
  if (data.toString().trim() == 'exit')  process.exit();
  fs.appendFile(fileName, data, (err) => { if (err) throw err; });
});

process.on('exit', () => stdout.write('Строки записаны в text.txt'));
process.on('SIGINT', () => { process.exit(); });