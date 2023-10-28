// Step-1 : Load the Driver
var mssql =require('mysql');
var exp = require('express');
var bparser = require('body-parser')    
bparserInit = bparser.urlencoded({extended:false});  
var cors = require('cors') ;            // with cors ... Data communication is availabe with security (Navigation)
var app = exp();//Initialize expressjs
app.use(cors());// Initialize
app.use(exp.json());
 
// host means - on which machine the Database is stored
// for MYSQL port number is - port:3306 ...  for MSSQL - 1433
mssqlconnection=mssql.createConnection({
    host:'localhost',
    database:'world',
    user:'root',
    password:'root',
    port:3306
});
 
function checkConnection(error){
    if(error == undefined){
        console.log("Connected to the database......");    // it will tells whether database is connected or not
     }
     else{
         console.log("error code :" + error.errno)
         console.log(error.message);
     }
}
//mssql.connect(createConnection, checkConnection);
function feedback(error){
    if(error != undefined){
        console.log(error.errno);
        console.log(error.message);
    }else
        console.log("Open the browser and visit http://localhost:9901/")
 
}
app.listen(9901, feedback)
 
//Get Request
var queryresults = undefined;
function processResults(error, results){
    queryresults=results;
    console.log(results);
}
 
function displayAllUsers(request, response){
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query('select * from users',processResults);
    response.send(queryresults);
}
app.get('/getAll',displayAllUsers)
 
//
function GetUserById(request, response){
    var userid = request.query.uid;
    // Parameterized sql, '?'- temporary placeholder, is replaced by value of userid
    mssqlconnection.query('select  * from users where userid=?',[userid],processResults);      //userid" +userid
    response.send(queryresults);
}
app.get('/getById',GetUserById)
//
function GetByEmailId(request, response){
 
}
app.get('getbyEmailId',GetByEmailId)
//

function insertUser(request,response){
    userid=request.body.uid;
    password=request.body.password;
    emailid=request.body.emailid;
    console.log(userid+"\t\t"+password+"\t\t"+emailid);
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query('insert into users values ( ?, ?, ?)',
        [userid,password,emailid], checkInsertStatus);
    response.send(JSON.stringify(statusMessage));
 
}
app.post('/insert',bparserInit,insertUser);

var statusMessage="";
function checkInsertStatus(error){
    statusMessage=(error == undefined)?"<b>Insert Successful</b>":
    "<b>Insert Failure" + error.message + "</b>";
}
 
//
function updateUser(request, response) {
    var userId = request.body.uid;
    var password = request.body.password;
    var emailid = request.body.emailid;
    mssqlconnection.query('UPDATE users SET password=?, emailid=? WHERE userid=?',
        [password, emailid, userId],
        function (error, results) {
            if (error == null) {
                statusMessage = "<b>Update successful</b>";
            } else {
                statusMessage = "<b>Update failure " + error.message + "</b>";
            }
            response.send(statusMessage);
        });
}
 
app.put('/update', bparserInit, updateUser);
 
//
var statusMessage="";
function checkDeleteStatus(error){
    (error == undefined)?statusMessage="<B>Delete Successful</b>":
    statusMessage="<b>Delete Failure" + error.message + "</b>";
}
function deleteUser(request, response){
    userid=request.query.uid;
    console.log (userid);
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query(
        'DELETE FROM users WHERE userid = ?',
        [userid], checkDeleteStatus);
        response.send(statusMessage);
}
 
app.delete('/delete',deleteUser)







































































































/*
var mssql = require('mysql');
var exp = require('express');
var bparser = require('body-parser');
var cors = require('cors');

var bparserInit = bparser.urlencoded({ extended: false });
var app = exp();
app.use(cors());
app.use(exp.json());

mssqlconnection = mssql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: "world"
});

function CheckConnection(error) {
    if (error == null) {
        console.log("Connected to the database...");
    } else {
        console.log("Error code: " + error.errno);
        console.log(error.message);
    }
}

function feedback(error) {
    if (error != undefined) {
        console.log(error.errno);
        console.log(error.message);
    } else {
        console.log("Open the browser and visit this URL: http://localhost:9901/getAll");
    }
}

app.listen(9901, feedback);

var queryresults = undefined;

function processResults(error, results) {
    queryresults = results;
    console.log(results);
}

function displayAllUsers(request, response) {
    mssqlconnection.query('select * from users', processResults);
    response.send(queryresults);
}

app.get('/getAll', displayAllUsers);

function getuserbyId(request, response) {
    var userId = request.query.uid;
    // parameterized SQL
    mssqlconnection.query('select * from users where userid=?', [userId], processResults);
    response.send(queryresults);
}

app.get('/getbyId', getuserbyId);

function getuserbyemailId(request, response) {
    var emailId = request.query.eid;
    // parameterized SQL
    mssqlconnection.query('select * from users where emailid=?', [emailId], processResults);
    response.send(queryresults);
}

app.get('/getbyemailId', getuserbyemailId);

var statusMessage = "";

function checkInsertStatus(error) {
    if (error == null) {
        statusMessage = "<b>Insert successful</b>";
    } else {
        statusMessage = "<b>Insert failure " + error.message + "</b>";
    }
}

function insertUser(request, response) {
    var userid = request.body.uid;
    var password = request.body.password;
    var emailid = request.body.emailid;
    console.log(userid + "\t\t" + password + "\t\t" + emailid);
    mssqlconnection.query('insert into users (userid, password, emailid) values (?, ?, ?)',
        [userid, password, emailid], checkInsertStatus);
    response.send(statusMessage);
}

app.post('/insert', bparserInit, insertUser);


function deleteUserById(request, response) {
    var userId = request.query.uid;

    mssqlconnection.query('DELETE FROM users WHERE userid = ?', [userId], function (error) {
        if (error == null) {
            statusMessage = "<b>Delete successful</b>";
        } else {
            statusMessage = "<b>Delete failure " + error.message + "</b>";
        }
        response.send(statusMessage);
    });
}

app.delete('/delete', deleteUserById);





 

function updateUser(request, response) {
    var userId = request.body.uid;
    var password = request.body.password;
    var emailid = request.body.emailid;
    mssqlconnection.query('UPDATE users SET password=?, emailid=? WHERE userid=?',
        [password, emailid, userId],
        function (error, results) {
            if (error == null) {
                statusMessage = "<b>Update successful</b>";
            } else {
                statusMessage = "<b>Update failure " + error.message + "</b>";
            }
            response.send(statusMessage);
        });
}

app.put('/update', bparserInit, updateUser);


*/


























































































































/*
var mssql=require('mysql');
var exp=require('express');
var bparser= require('body-parser');
var cors=require ('cors');
bparserInit=bparser.urlencoded({extended:false})
var app=exp();
app.use(cors());
app.use(exp.json());
mssqlconnection=mssql.createConnection({
    host:'localhost',
    port:3306,
    user: 'root',
    password:'root',
   
    database:"world"

});

function CheckConnection(error){
    if(error == undefined){
        console.log("Connected to database...");  
    }
        else{
    console.log("Error code :" + error.errno)
    console.log(error.message);}
   
}

function feedback(error)
{

    if(error!= undefined)
    {
    console.log(error.errno);
   console.log(error.message);

    }
    else
    console.log("Open the browser and visit this url http://localhost:9901/getAll")



}

app.listen(9901, feedback);
var queryresults=undefined;



function processResults(error, results)
{
    queryresults=results;
    console.log(results);

}
function displayAllUsers(request, response){

    mssqlconnection.connect(CheckConnection);
    mssqlconnection.query('select * from users', processResults);
    response.send(queryresults);


}

app.get('/getAll', displayAllUsers);


function getuserbyId(request, response){

    var userId=request.query.uid;
    //parameterized sql
    mssqlconnection.query('select * from users where userid=?',  [userId],processResults);
    
    response.send(queryresults);

        
}


app.get('/getbyId', getuserbyId);



function getuserbyemailId(request, response){

    var emailId=request.query.eid;
    //parameterized sql
    mssqlconnection.query('select * from users where emailid=?',  [emailId],processResults);
    
    response.send(queryresults);

        
}


app.get('/getbyemailId', getuserbyemailId);

var statusMessage="";
function checkInsertStatus(error){

    (error== undefined)?statusMessage="<B>Insert successful</b>":
    statusMessage="<b>Insert failure " + error.message + "</b>";

    
}


function insertUser(request,response){
    userid=request.body.uid;
    password=request.body.password;
    emailid=request.body.emailid;
    console.log(userid + "\t\t" + password + "\t\t" + emailid);
    mssqlconnection.connect(checkConnection);
    mssqlconnection.query('insert into users values ( ?, ?, ?)',
        [userid,password,emailid], checkInsertStatus);
    response.send(statusMessage);
 
}
app.post('/insert',bparserInit,insertUser);



//mssqlconnection.connect(CheckConnection)



*/


/*

var mssql=require('mssql')
mssqlconnection=mssql.createConnection({
    host:'localhost',
    port:1433,
    options:{trustedConnection:true},
    driver:"msnodesqlv8",
    server:"200411LTP2811\\SQLEXPRESS",
    database:"ReactJSDatabase"

});

function CheckConnection(err) {
  if (err === null) {
    console.log('Connected to the database...');
  } else {
    console.error('Error code: ' + err.code);
    console.error(err.message);
  }
}

mssql.connect(config, CheckConnection);

*/

