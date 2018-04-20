var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dainty",
    database: 'bamazon'
});

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);

// };

var check = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['ID', 'product Name', 'Department', 'Price', 'Stock Quantity']
        });

        //DISPLAYS ALL ITEMS FOR SALE 
        console.log("HERE ARE ALL THE ITEMS AVAILABLE FOR SALE: ");
        console.log("===========================================");
        for (var i = 0; i < res.length; i++) {

            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        console.log("-----------------------------------------------");
        //LOGS THE COOL TABLE WITH ITEMS IN FOR PURCHASE. 
        console.log(table.toString());



        // connection.end();



        inquirer.prompt([{

            name: "ItemId",
            type: "input",
            message: "What is the item id you would like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }, {
            name: "Quantity",
            type: "input",
            message: "How many of this item would you like to buy?",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }

        }]).then(function (answer) {
            var chosenId = answer.ItemId - 1
            var chosenProduct = res[chosenId]
            var chosenQuantity = answer.Quantity;

            if (chosenQuantity < res[chosenId].stock_quantity) {
                console.log("Your total for " + "(" + answer.Quantity + ")" + " - " + res[chosenId].product_name + " is: " + res[chosenId].price.toFixed(2) * chosenQuantity);
                // console.log(`Your total for ${answer.Quantity} -${res[chosenId].product_name} is: ${res[chosenId].price.toFixed(2) * chosenQuantity}`);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: res[chosenId].stock_quantity - chosenQuantity
                }, {
                    id: res[chosenId].id

                }], function (err, res) {
                    check();

                });
            } else {
                console.log("sorry, insufficient quantity in stock at this time. all we have is " + res[chosenId].stock_quantity + "in our inventory.");
                check();
            }
        })
    })

}
check();