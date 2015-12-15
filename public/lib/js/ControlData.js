/* Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   select1.js
 *
 * DESCRIPTION
 *   Executes a basic query without using a ResultSet.
 *   Uses Oracle's sample HR schema.
 *
 *   Scripts to create the HR schema can be found at:
 *   https://github.com/oracle/db-sample-schemas
 *
 *****************************************************************************/

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var Good = require('./Good.js');
var async = require('async');
var go = false;
var id;
var DataBase = function(){
     
}
module.exports = DataBase;
DataBase.prototype.selectFromWhole=function(callback){
   var list = new Array();
   oracledb.getConnection(
        {
          user          : dbConfig.user,
          password      : dbConfig.password,
          connectString : dbConfig.connectString
        },
        function(err, connection)
        {
          if (err) {
            console.error(err.message);
            return;
          }
          connection.execute(
            "SELECT id,name,numbers " +
              "FROM wholeinfo ",
            [],
            function(err, result)
            {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
      //        console.log(result.metaData);
      //        console.log(result.rows.length);
      //        console.log(result.rows[0].length);
              for(var i=0;i<result.rows.length;i++){
                    var good = new Good(result.rows[i][0],result.rows[i][1],result.rows[i][2]);
                    list[i]=good;       
              }
              go = true;
              for(var i =0 ;i<list.length;i++){
                var good = list[i];
                console.log(good.id+" "+good.name+" "+good.number);
              }
              doRelease(connection);
              callback(list);
            }); 
        });
}
//nodejs 不支持setTimeout 只能这么写
function TimeoutHandler(){
  clearTimeout(id);
  oracledb.getConnection(
        {
          user          : dbConfig.user,
          password      : dbConfig.password,
          connectString : dbConfig.connectString
        },
        function(err, connection)
        {
          if (err) {
            console.error(err.message);
            return;
          }
          connection.execute(
            "SELECT id,name,numbers " +
              "FROM wholeinfo ",
            [],
            function(err, result)
            {
              if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
              }
      //        console.log(result.metaData);
      //        console.log(result.rows.length);
              console.log(result.rows[0].length);
              for(var i=0;i<result.rows.length;i++){
                    var good = new Good(result.rows[i][0],result.rows[i][1],result.rows[i][2]);
                    list[i]=good;       
              }
              go = true;
              for(var i =0 ;i<list.length;i++){
                var good = list[i];
                console.log(good.id+" "+good.name+" "+good.number);
              }
              doRelease(connection);
            }); 
        });
}
function sendData(){
   if(go){
     
   }else{
    console.log("wait");
    id=setTimeout(TimeoutHandler,50); 
   }
}
function doRelease(connection)
{
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
