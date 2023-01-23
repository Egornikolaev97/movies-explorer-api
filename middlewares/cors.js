// домены, разрешенные для крос-доменных запросов
const allowedCors = [
  'http://api.nikolaev.movies.nomoredomains.icu/',
  'https://api.nikolaev.movies.nomoredomains.icu/',
  'http://nikolaev.movies.nomoredomains.icu/',
  'https://nikolaev.movies.nomoredomains.icu/',
  'http://localhost:3500/',
  'https://localhost:3500/',
  'https://localhost:3000/',
  'http://localhost:3000/',

];

module.exports.cors = (req, res, next) => {
  const { origin } = req.headers; // сохраняем источник в origin
  const { method } = req; // сохраняем hhtp
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  // проверка, разрешен ли источник запроса
  if (allowedCors.includes(origin)) {
    // разрешаем запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
