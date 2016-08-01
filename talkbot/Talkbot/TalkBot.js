// DO NOT DELETE : this gist is referenced by a live article

//
// Cisco Spark Logging Library for Tropo
//
//webhook url : Y2lzY29zcGFyazovL3VzL1dFQkhPT0svNTFiYTY3NjktMzFhZC00NjVhLThmMTktNzZkZTVmZTI5YWFh
// Factory for the Spark Logging Library, with 2 parameters
//    - the name of the application will prefix all your logs, 
//    - the Spark Incoming integration (to  which logs will be posted)
// To create an Incoming Integration
//   - click integrations in the right pane of a Spark Room (Example : I create a dedicated "Tropo Logs" room)
//   - select incoming integration
//   - give your integration a name, it will be displayed in the members lists (Example : I personally named it "from tropo scripting")
//   - copy your integration ID, you'll use it to initialize the SparkLibrary
function SparkLog(appName, incomingIntegrationID) {
    
    if (!appName) {
        log("SPARK_LOG : bad configuration, no application name, exiting...");
        throw createError("SparkLibrary configuration error: no application name specified");
    }
    this.tropoApp = appName;

    if (!incomingIntegrationID) {
        log("SPARK_LOG : bad configuration, no Spark incoming integration URI, exiting...");
        throw createError("SparkLibrary configuration error: no Spark incoming integration URI specified");
    }
    this.sparkIntegration = incomingIntegrationID;
        
    'log("SPARK_LOG: all set for application:" + this.tropoApp + ", posting to integrationURI: " + this.sparkIntegration);'
}

// This function sends the log entry to the registered Spark Room 
// Invoke this function from the Tropo token-url with the "sparkIntegration" parameter set to the incoming Webhook ID you'll have prepared
// Returns true if the log entry was acknowledge by Spark (ie, got a 2xx HTTP status code)
SparkLog.prototype.log = function(newLogEntry) {
    
    // Robustify
    if (!newLogEntry) {
        newLogEntry = "";
    }
    
    var result;
    try {
        // Open Connection
        var url = "https://api.ciscospark.com/v1/webhooks/incoming/" + this.sparkIntegration;
        connection = new java.net.URL(url).openConnection();

        // Set timeout to 10s
        connection.setReadTimeout(10000);
        connection.setConnectTimeout(10000);

        // Method == POST
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        
        // TODO : check if this cannot be removed
        connection.setRequestProperty("Content-Length", newLogEntry.length);
        connection.setUseCaches (false);
        connection.setDoInput(true);
        connection.setDoOutput(true); 

        //Send Post Data
        bodyWriter = new java.io.DataOutputStream(connection.getOutputStream());
        log("SPARK_LOG: posting: " + newLogEntry + " to: " + url);
        contents = '{ "text": "' + this.tropoApp + ': ' + newLogEntry + '" }'
        bodyWriter.writeBytes(contents);
        bodyWriter.flush ();
        bodyWriter.close (); 

        result = connection.getResponseCode();
        log("SPARK_LOG: read response code: " + result);

        if(result < 200 || result > 299) {
            log("SPARK_LOG: could not log to Spark, message format not supported");
            return false;
        }
    }
    catch(e) {
        log("SPARK_LOG: could not log to Spark, socket Exception or Server Timeout");
        return false;
    }
    
    log("SPARK_LOG: log successfully sent to Spark, status code: " + result);
    return true; // success
}

// Let's create several instances for various log levels
// Note that you may spread logs to distinct rooms by changing the integrationId
var SparkInfo = new SparkLog("APPNAME - INFO:", "Y2lzY29zcGFyazovL3VzL1dFQkhPT0svNTFiYTY3NjktMzFhZC00NjVhLThmMTktNzZkZTVmZTI5YWFh");
var SparkDebug = new SparkLog("APPNAME - DEBUG:", "Y2lzY29zcGFyazovL3VzL1dFQkhPT0svNTFiYTY3NjktMzFhZC00NjVhLThmMTktNzZkZTVmZTI5YWFh");
// info level used to get a synthetic sump up of what's happing
function info(logEntry) {
  log("INFO: " + logEntry);
  SparkInfo.log(logEntry);
  // Uncomment if you opt to go for 2 distinct Spark Rooms for DEBUG and INFO log levels
  //SparkDebug.log(logEntry); 
}

// debug level used to get detail informations
function debug(logEntry) {
  log("DEBUG: " + logEntry);
  SparkDebug.log(logEntry);
}

var list = [];
var cost = 0;
var mins = 0;
d1 = new Date();
d2 = new Date(d1);
d1.setMinutes(d1.getMinutes()-420);

//Seat number
order_number = ask("Hello there thank you for placing an order with us. Please enter your seat number followed by the pound key.",{
    choices:"[1-3 DIGITS]",
    terminator:"#",
    timeout:8.0,
    onChoice: function(event){
        //say("On Choice!");
        say(choice.value);
    },
    onBadChoice: function(event){
        say("On Bad Choice");
    }
    });
var str = "SEAT :"+order_number.value;
list.push(str);

//Main Menu
do{
choice = ask("Main menu: What would you like to order? Press 1 to order beer, press 2 to order hotdogs,press 3 to order peanuts, Terminate with a pound sign!",{
    choices:"[1-3 DIGITS]",
    terminator:"#",
    timeout:8.0,
    onChoice: function(event){
        //say("On Choice!");
    },
    onBadChoice: function(event){
        say("On Bad Choice");
    }
    });

while(choice.value>0)
{
    var digit = choice.value%10;
    
    switch(digit)
    {
        //Beer Menu
        case 1:   
            do{
                beer = ask("Beer menu... Please select what type of beer you would like to add to your order, press 1 for Bud light, press 2 for Budweiser, press 3 for Heineken,",{
                choices:"[1 DIGIT]",
                timeout:10.0,
                mode:"dtmf",
                onChoice: function(event){
                    //say("On Choice!");
                },
                onBadChoice: function(event){
                    //say("On Bad Choice");
                }
                });
                
                beerquantity = ask("How many would you like?",{
                choices:"[1-2 DIGITS]",
                timeout:4.0,
                mode:"dtmf",
                onChoice: function(event){
                    //say("On Choice!");
                },
                onBadChoice: function(event){
                    //say("On Bad Choice");
                }
                });
                if(beer.value==1)
                    name = "BudLight";
                if(beer.value==2)
                    name = "Budweiser";
                if(beer.value==3)
                    name = "Heineken";
                var str = "Beer: "+name+" "+beerquantity.value;
                list.push(str);
                cost=cost+beerquantity.value*8;
                mins=mins+beerquantity.value*2;
                
                ch = ask("Would you like any other kind of beer? 1.Yes 2.No",{
                choices:"[1 DIGIT]",
                timeout:10.0,
                mode:"dtmf",
                onChoice: function(event){
                    //say("On Choice!");
                },
                onBadChoice: function(event){
                    //say("On Bad Choice");
                }
                });
                
            }while(ch.value==1);
            break;
        
        //Hotdogs menu
        case 2:
            hotdogs = ask("How many HotDogs would you like?",{
            choices:"[1-2 DIGITS]",
            timeout:5.0,
            mode:"dtmf",
            onChoice: function(event){
               // say("On Choice!");
            },
            onBadChoice: function(event){
                say("On Bad Choice");
            }
            });
            var str = "HotDogs:"+hotdogs.value;
            list.push(str);
            cost = cost + hotdogs.value*8.5;
            mins = mins+hotdogs.value*3;
            break;
        
        //Peanuts Menu
        case 3:
            peanuts = ask("How many bags of peanuts would you like?",{
            choices:"[1-2 DIGITS]",
            timeout:5.0,
            mode:"dtmf",
            onChoice: function(event){
                //say("On Choice!");
            },
            onBadChoice: function(event){
                //say("On Bad Choice");
            }
            });
            var str = "Peanuts:"+peanuts.value;
            list.push(str);
            cost = cost + peanuts.value*5.5;
            mins = mins+peanuts.value*1;
            break;
            
        default:
            say("Wrong choice!");
    }
    
    choice.value=Math.round(choice.value/10);
}
        ch = ask("Press 1 if you want to order more items. 2. Repeat order. 3. Cancel order",{
                choices:"[1 DIGIT]",
                timeout:10.0,
                mode:"dtmf",
                onChoice: function(event){
                    //say("On Choice!");
                },
                onBadChoice: function(event){
                    //say("On Bad Choice");
                }
                });
                
        //info("Repeating order1"+ch.value);
        var ex = ch.value;
        if(ex==2) 
        {
            say(list);
            say("Cost :"+cost+"Dollars");
            d2.setMinutes(d1.getMinutes()+mins);
            d2.setMinutes(d2.getMinutes()-420);
            //info("You will receive this order at : "+d2.getHours()+":"+d2.getMinutes());
        }
        if(ex==3) 
        {
            list=[];
            cost=0;
            mins=0;
        }
     
        
}while(ch.value==1);
list.push(cost);
info(list);

//After done ordering, option whether to pay right now

    //Card number
    cardNum = ask("Please enter your 16 digit card number, followed by the pound key.",{
    choices:"[16 DIGITS]",
    timeout:15.0,
    mode:"dtmf",
    onChoice: function(event){
        //say("On Choice!");
    },
    onBadChoice: function(event){
        //say("On Bad Choice");
    }
    });
    //Expiration Month
    expMonth = ask("Please enter the expiration month followed by the pound key.",{
    choices:"[1-2 DIGITS]",
    timeout:5.0,
    mode:"dtmf",
    onChoice: function(event){
        //say("On Choice!");
    },
    onBadChoice: function(event){
        //say("On Bad Choice");
    }
    });
    //Expiration Year
    expYear = ask("Please enter the 2 digit expiration year followed by the pound key.",{
    choices:"[2 DIGITS]",
    timeout:5.0,
    mode:"dtmf",
    onChoice: function(event){
        //say("On Choice!");
    },
    onBadChoice: function(event){
        //say("On Bad Choice");
    }
    });

    //will be pushed to the bank api!
    say("Your order has been placed.You will receive this order at : "+d2.getHours()+":"+d2.getMinutes());
