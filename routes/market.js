var simple_recaptcha = require('simple-recaptcha');
var mysql = require('mysql');
var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : 'root',
database: 'DB_VFM_v1'
});


/*
 * GET home page.
 */

//handler for index page
exports.index = function(req, res){
	
	res.render('index', { title: 'Virtual Farmers Market' ,sess:req.session});
		
};

//handler for displaying the produces
exports.produces=function(req,res){
  
    res.render('produces',{title:'Farmers Market - Our Produces', sess:req.session});
};

//handler for displaying the farmers
exports.farmers=function(req,res){
  
    res.render('farmers',{title:'Farmers Market - Our Farmers',sess:req.session});
};

//handler for displaying the new user form
exports.newuser=function(req,res){
   
    res.render('newuser',{title:'Farmers Market - Guests',sess:req.session});

};

//handler for displaying error in authentication
exports.autherror=function(req,res){
	res.render();
}


exports.authenticateuser=function(req, res){
	
	console.log("authenticating the user");
	var query1 = 'select * from customer where emailaddr ="'+req.body.email+'" AND password="'+req.body.passwd+'"';
	var query2 = 'select * from farmer where emailaddr="'+req.body.email+'" AND password="'+req.body.passwd+'"';
	var accounttype="";
	connection.query(query2, function (error, frows, fields) { 
		 if(!error && frows.length != 0) {
			 //var farmer = true;
			 console.log("farmer");
			 accounttype = "farmer";
			 req.session.accounttype=accounttype;
			 console.log('@'+accounttype+'@');
			 res.render('newuser',{title:'Farmers Market - farmer',sess:req.session});
		 }
		 else {
			 res.render('error',{title:'error in login'}); 
		 }
	});
	connection.query(query1, function (error, rows, fields) { 
		 if(!error && rows.length != 0) {
			 //var cust = true;
			 console.log("customer");
			 accounttype = "customer"; 
			 req.session.accounttype=accounttype;
			 console.log('@'+accounttype+'@');
			 res.render('newuser',{title:'Farmers Market - customer',sess:req.session});
		 }
		 else {
			 res.redirect("error.ejs"); 
		 }

	});
	
		
};
	


exports.registeruser=function(req,res){

   //res.render('newuser',{title:'Farmers Market - Guests'});
	console.log(req.body.fname);
	console.log(req.ip);
	console.log(req.body.recaptcha_challenge_field);
	console.log(req.body.recaptcha_response_field);
	var privateKey = '6LffFOgSAAAAABuD3YZUrxA-ZYZ64CcABY6bq6l7'; // your private key here
	var ip = req.ip;
	var challenge = req.body.recaptcha_challenge_field;
	var response = req.body.recaptcha_response_field;
	var found1 = false;
	var found2 = false;

	  simple_recaptcha(privateKey, ip, challenge, response, function(err) {
	    if (err) {return res.send(err.message);}
	    else{
	    res.send('verified');
	    console.log("verified");
	    //connect to DB and insert this user
	    var connect = function(connection) {connection.connect();}
	    //verify if user already exists
	    var e = req.body.custorfarmer;
	    	   
	    if ('customer' == e) {
	    	var query = 'select * from customer where emailaddr="'+req.body.email+'"';
	    	console.log(query);
	    	connection.query(query, function (error, rows, fields) { 
	    		 if(!error && rows.length != 0)
	    			 found1 = true;
	    		 
	    	});
	    }
	    if ('farmer' == e) {
	    	var query = 'select * from farmer where emailaddr="'+req.body.email+'"';
		    console.log(query);
		    connection.query(query, function (error, rows, fields) { 
	    		 if(!error && rows.length != 0)
	    			 found2 = true;
	    	}); 
	    }
	    if (found1 == true || found2 == true)
	    	console.log("You already have account with us! Please use 'forgot password' to retrieve your password");
	    else {
	    	if('customer' == e) {
	    		var query = 'insert into customer(name, lastname, emailaddr, login, password) values ("'
	    			+ req.body.fname +'","'+ req.body.lname +'","'+ req.body.email+'","'+ req.body.userid + '","' + req.body.passwd + 
	    			'"'+')';
	    			console.log(query);
		    		connection.query(query, function (error, rows, fields) {
		    			if (!error)
		    				console.log("New user has been created successfully");
		    			if (error)
		    				console.log("New customer couldn't be created");
		    		});
	    	}
	    	if('farmer' == e) {
	    		var query = 'insert into farmer(name, lastname, emailaddr, login, password) values ("' 
	    			+ req.body.fname +'","'+ req.body.lname +'","'+ req.body.email+'","'+ req.body.userid + '","' + req.body.passwd + 
	    			'"'+')';
	    			console.log(query);
		    		connection.query(query, function (error, rows, fields) {
		    			if (!error)
		    				console.log("New user has been created successfully");
		    			if (error)
		    				console.log("New farmer couldn't be created");
		    		});
	    	}
	    	
	    }
	    	
	    
	    }
	    
	    
	  });
	  res.render('newuser',{title:'Farmers Market - User!'});

};
