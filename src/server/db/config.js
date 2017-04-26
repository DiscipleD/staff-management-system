/**
 * @author Disciple_D
 * @homepage https://github.com/discipled/
 * @since 24/04/2017
 */

const HOST = 'localhost';
const PORT = '27017';
const DB = '/staffManagement';

const url = `mongodb://${HOST}:${PORT}${DB}`;
const options = { promiseLibrary: global.Promise };

export { url, options };
