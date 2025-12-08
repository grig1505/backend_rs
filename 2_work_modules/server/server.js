const http = require('http');
const chalk = require('chalk');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello World</h1>');
}).listen(3000, () => {
  console.log(chalk.green('Server is running on port 3000'));
});
