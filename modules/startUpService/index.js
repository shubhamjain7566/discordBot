
/**
 * 
 * CREATED BY SHUBHAM JAIN ON 28 OCT 19
 * 
 **/


const mysql      = require('mysql');
const constants  = require('../properties/constants');

connection       = undefined; // making connection global

exports.runQuery = runQuery;


connection = mysql.createConnection(constants.mysqslConnectionObject); 
connection.connect();
console.log("CONNECTION CREATED WITH MYSQL")

function runQuery(queryString, params,) {
  return new Promise((resolve, reject) => {
   
    let query = connection.query(queryString, params, function (sqlError, sqlResult) {
      console.log({
        QUERY            : query.sql,
        SQL_ERROR        : sqlError,
        SQL_RESULT       : sqlResult,
        SQL_RESULT_LENGTH: sqlResult && sqlResult.length,
        params           : params
      });
      if (sqlError) {
        console.error(queryString, sqlError);
        return reject(sqlError);
      }
      
      return resolve(sqlResult);
    });
  });
}