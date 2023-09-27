const express = require('express')
const cors = require('cors')
const mysql = require('mysql');
const app = express()
const PORT = process.env.PORT || 3500

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cactusgreen"
});
con.connect(function(err) {
    if (err) 
        throw err;
    con.query("USE sakila", function (err, result, fields) {
        if (err) 
            throw err;
    });
    console.log("connected to sakila database");
});

/*Returns number of rows where value is found in column in table (used for input sanitization) */
async function value_count_in_column(table_name, column_name, value)
{
    sql_string = "SELECT COUNT(*) AS count FROM " + table_name + " WHERE " + column_name + " = ";
    if(typeof(value) == "string")
        sql_string += "'";
    sql_string += value;
    if(typeof(value) == "string")
        sql_string += "'";
    sql_string += ";";

    return new Promise(function(resolve, reject){
        con.query(sql_string,
        function (err, result, fields) {
            if (err) 
                reject(-1);
            else
                resolve(result[0].count);
        });
    })

}
/* This function assumes the value exists, and gets the value of column_get in the row where column_where = value_where*/
async function get_value_where(table_name, column_where, value_where, column_get)
{
    sql_string = "SELECT " + column_get + " AS result FROM " + table_name + " WHERE " + column_where + " = ";
    if(typeof(value) == "string")
        sql_string += "'";
    sql_string += value_where;
    if(typeof(value) == "string")
        sql_string += "'";
    sql_string += ";";
    return new Promise(function(resolve, reject){
        con.query(sql_string,
        function (err, result, fields) {
            if (err) 
                reject(-1);
            else
            {
                resolve(result[0].result);
            }
        });
    })

}
  
app.use(cors({
    origin: '*'
}));
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
app.get('/healthcheck', (req, res) => {
    res.status(200).send({
        value: 'Hello world'
    })
});
app.get('/get_top_5_rented_films', (req, res) => {
    con.query("SELECT T1.film_id, film.title, COUNT(T1.rental_id) AS number_of_rentals from (SELECT rental.rental_id, inventory.inventory_id, inventory.film_id FROM rental INNER JOIN inventory ON inventory.inventory_id = rental.inventory_id) T1 INNER JOIN film ON film.film_id = T1.film_id GROUP BY T1.film_id ORDER BY COUNT(T1.rental_id) DESC LIMIT 5;", 
    function (err, result, fields) {
        if (err) 
            throw err;

        res.status(200).send({
            failure: 0,
            message: "",
            result_table: result
        })
    });
});
app.get('/get_top_5_actors', (req, res) =>{con.query("SELECT actor.actor_id, actor.first_name, actor.last_name, COUNT(T1.title) AS number_of_films FROM (SELECT film.film_id, film.title, film_actor.actor_id FROM film INNER JOIN film_actor ON film.film_id=film_actor.film_id) T1 INNER JOIN actor ON T1.actor_id=actor.actor_id GROUP BY T1.actor_id ORDER BY COUNT(T1.title) DESC LIMIT 5;", 
    function (err, result, fields) {
        if (err) 
            throw err;

        res.status(200).send({
            failure: 0,
            message: "",
            result_table: result
        })
    });
})
app.get('/get_film_info', (req, res) => {
    if(req.headers.film_id)
    {
        if(/^[0-9]*$/.test(req.headers.film_id)) /* Only accept numerical values (no sql injection please) */
        {
            con.query("SELECT film_id, title, description, release_year, rating FROM film WHERE film_id=" + req.headers.film_id + ";", 
            function (err, result, fields) {
                if (err) 
                    throw err;
        
                res.status(200).send({
                    failure: 0,
                    message: "",
                    result_table: result
                })
            });
        }
    }
});

app.get('/get_actor_info', (req, res) => {
    if(req.headers.actor_id)
    {
        if(/^[0-9]*$/.test(req.headers.actor_id)) /* Only accept numerical values (no sql injection please) */
        {
            con.query("SELECT T3.first_name, T3.last_name, T3.film_id, film.title, T3.number_of_rentals FROM (SELECT COUNT(T2.rental_id) AS number_of_rentals, T2.film_id, actor.actor_id, actor.first_name, actor.last_name FROM (SELECT T1.film_id, T1.rental_id, film_actor.actor_id FROM (SELECT rental.rental_id, inventory.film_id FROM rental INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id) T1 INNER JOIN film_actor ON T1.film_id = film_actor.film_id) T2 INNER JOIN actor ON T2.actor_id = actor.actor_id WHERE actor.actor_id = "
            + req.headers.actor_id
            + " GROUP BY T2.film_id) T3 INNER JOIN film ON T3.film_id = film.film_id ORDER BY number_of_rentals DESC LIMIT 5;", 
            function (err, result, fields) {
                if (err) 
                    throw err;
        
                res.status(200).send({
                    failure: 0,
                    message: "",
                    result_table: result
                })
            });
        }
    }
});
app.get('/get_film_list', (req, res) => {
    /* Sanitize input */
    if(req.headers.title)
    {
        if(!/^[a-zA-Z ]*$/.test(req.headers.title))
        {
            res.status(200).send({
                failure: 1,
                message: 'Title can only contain letters and spaces'
            })
            return;
        }
    }
    if(req.headers.actor_first_name)
    {
        if(!/^[a-zA-Z\-]*$/.test(req.headers.actor_first_name))
        {
            res.status(200).send({
                failure: 1,
                message: 'Actor first name can only contain letters and hyphens'
            })
            return;
        }
    }
    if(req.headers.actor_last_name)
    {
        if(!/^[a-zA-Z\-]*$/.test(req.headers.actor_last_name))
        {
            res.status(200).send({
                failure: 1,
                message: 'Actor last name can only contain letters and hyphens'
            })
            return;
        }
    }
    if(req.headers.genre)
    {
        if(!/^[a-zA-Z\ ]*$/.test(req.headers.genre))
        {
            res.status(200).send({
                failure: 1,
                message: 'Genre can only contain letters and spaces'
            })
            return;
        }
    }
    var sql_string = "SELECT DISTINCT T3.film_id, T3.title, T3.name AS category, T3.description FROM (SELECT T2.film_id, T2.title, T2.name, T2.description, film_actor.actor_id FROM (SELECT T1.film_id, T1.title, T1.description, category.name FROM (SELECT film.film_id, film.title, film_category.category_id, film.description FROM film INNER JOIN film_category ON film.film_id = film_category.film_id) T1 INNER JOIN category ON T1.category_id = category.category_id) T2 INNER JOIN film_actor ON T2.film_id = film_actor.film_id) T3 INNER JOIN actor ON T3.actor_id = actor.actor_id WHERE 1=1";
    if(req.headers.title)
    {
        sql_string += " AND LOWER(T3.title) LIKE LOWER('%" + req.headers.title + "%')";
    }
    if(req.headers.genre)
    {
        sql_string += " AND LOWER(T3.name) = LOWER('" + req.headers.genre + "')";
    }
    if(req.headers.actor_first_name)
    {
        sql_string += " AND LOWER(actor.first_name) LIKE LOWER('%" + req.headers.actor_first_name + "%')"; 
    }
    if(req.headers.actor_last_name)
    {
        sql_string += " AND LOWER(actor.last_name) LIKE LOWER('%" + req.headers.actor_last_name + "%')";
    }
    sql_string += " ORDER BY T3.film_id;";
    con.query(sql_string, 
    function (err, result, fields) {
        if (err) 
            throw err;

        res.status(200).send({
            failure: 0,
            message: result.length + " film(s) returned",
            result_table: result
        })
    });
    
});
app.get('/get_customer_list', (req, res) => {
    /*Input santization*/
    if(req.headers.customer_id)
    {
        if(!/^[0-9]*$/.test(req.headers.customer_id))
        {
            res.status(200).send({
                failure: 1,
                message: 'Customer ID must be a number'
            })
            return;
        }
    }
    if(req.headers.customer_first_name)
    {
        if(!/^[a-zA-Z\-]*$/.test(req.headers.customer_first_name))
        {
            res.status(200).send({
                failure: 1,
                message: 'First name must contain only letters or hyphens'
            })
            return;
        }
    }
    if(req.headers.customer_last_name)
    {
        if(!/^[a-zA-Z\-]*$/.test(req.headers.customer_last_name))
        {
            res.status(200).send({
                failure: 1,
                message: 'Last name must contain only letters or hyphens'
            })
            return;
        }
    }

    var sql_string = "SELECT customer_id, first_name, last_name, email, store_id, address_id FROM customer WHERE active = TRUE ";
    if(req.headers.customer_id)
    {
        sql_string += " AND LOWER(customer_id) = LOWER('" + req.headers.customer_id + "')";
    }
    if(req.headers.customer_first_name)
    {
        sql_string += " AND LOWER(first_name) = LOWER('" + req.headers.customer_first_name + "')";
    }
    if(req.headers.customer_last_name)
    {
        sql_string += "AND LOWER(last_name) = LOWER('" + req.headers.customer_last_name + "')";
    }
    sql_string += ";";
    con.query(sql_string, 
    function (err, result, fields) {
        if (err) 
            throw err;

        res.status(200).send({
            failure: 0,
            message: result.length + " customer(s) returned",
            result_table: result
        })
    });
    
});
app.post("/add_customer", (req, res) => {

    /*Input sanitization*/
    if(!req.headers.store_id || !req.headers.first_name || !req.headers.last_name || !req.headers.address_id)
    {
        res.status(200).send({
            failure: 1,
            message: 'Missing values. All values except email are required.'
        })
        return;
    }
    if(!/^[0-9]*$/.test(req.headers.store_id) || !/^[0-9]*$/.test(req.headers.address_id))
    {
        res.status(200).send({
            failure: 1,
            message: 'Store id and address id must be numbers.'
        })
        return;
    }
    if(!/^[a-zA-Z\-]*$/.test(req.headers.first_name) || !/^[a-zA-Z\-]*$/.test(req.headers.last_name))
    {
        res.status(200).send({
            failure: 1,
            message: 'First and last name must contain only letters and hyphens.'
        })
        return;
    }
    if(req.headers.email)
    {
        if(!/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(req.headers.email)) /* I stole this regex from https://saturncloud.io/blog/how-can-i-validate-an-email-address-using-a-regular-expression/ */
        {
            res.status(200).send({
                failure: 1,
                message: 'The email must be a valid email.'
            })
            return;
        }
    }

    /*Determine if the database can accept the request*/
    value_count_in_column("store", "store_id", req.headers.store_id).then( function(count){ /*The store must exist*/
    if(count == 0)
    {
        res.status(200).send({
            failure: 1,
            message: 'The store id corresponds to a store that does not exist.'
        })
        return;
    }

    /*Insertion*/
    sql_string = "INSERT INTO customer (store_id, first_name, last_name, ";
    if(req.headers.email)
    {
        sql_string += "email, ";
    }
    sql_string += "address_id, create_date) VALUES (" + req.headers.store_id + ", '" + req.headers.first_name + "', '" + req.headers.last_name + "', ";
    if(req.headers.email)
    {
        sql_string += "'" + req.headers.email + "', ";
    } 
    sql_string += req.headers.address_id + ", NOW() );";

    con.query(sql_string, 
    function (err, result, fields) {
        if (err) 
            throw err;

        res.status(200).send({
            failure: 0,
            message: 'Customer added'
        })
    });
    });
})
app.post("/update_customer", (req, res) => {
    /*Input sanitization*/
    if(!req.headers.customer_id)
    {
        res.status(200).send({
            failure: 1,
            message: 'Customer ID is needed to update customer information.'
        })
        return;
    }
    if(!req.headers.store_id && !req.headers.first_name && !req.headers.last_name && !req.headers.address_id && !req.headers.email)
    {
        res.status(200).send({
            failure: 1,
            message: 'No values are set to be updated.',
        })
        return;
    }
    if(req.headers.email)
    {
        if(!/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(req.headers.email)) /* I stole this regex from https://saturncloud.io/blog/how-can-i-validate-an-email-address-using-a-regular-expression/ */
        {
            res.status(200).send({
                failure: 1,
                message: 'The email must be a valid email.'
            })
            return;
        }
    }
    if(req.headers.store_id)
    {
        if(!/^[0-9]*$/.test(req.headers.store_id))
        {
            res.status(200).send({
                failure: 1,
                message: 'Store ID must be a number.',
            })
            return;
        }
    }
    if(req.headers.first_name)
    {
        if(!/^[a-zA-Z\-]*$/.test(req.headers.first_name))
        {
            res.status(200).send({
                failure: 1,
                message: 'First name must only contain letters and hyphens.',
            })
            return;
        }
    }
    if(req.headers.last_name)
    {
        if(!/^[a-zA-Z\-]*$/.test(req.headers.last_name))
        {
            res.status(200).send({
                failure: 1,
                message: 'Last name must only contain letters and hyphens.',
            })
            return;
        }
    }
    if(req.headers.address_id)
    {
        if(!/^[0-9]*$/.test(req.headers.address_id))
        {
            res.status(200).send({
                failure: 1,
                message: 'Address ID must be a number.',
            })
            return;
        }
    }
    /*Verify that the database can handle the request*/

    value_count_in_column("store", "store_id", req.headers.store_id ? req.headers.store_id : "").then( function(store_count){
    value_count_in_column("customer", "customer_id", req.headers.customer_id).then( function(customer_count){
    if(customer_count == 0)
    {
        res.status(200).send({
            failure: 1,
            message: 'Customer does not exist.',
        })
        return;
    }
    get_value_where("customer", "customer_id", req.headers.customer_id, "active").then( function(customer_is_active){
    if(customer_is_active == 0)
    {
        res.status(200).send({
            failure: 1,
            message: 'Customer does not exist.',
        })
        return;
    }
    
    if(req.headers.store_id && store_count < 1)
    {
        res.status(200).send({
            failure: 1,
            message: 'Store ID corresponds to a store that does not exist.',
        })
        return;
    }
    var sql_string = "UPDATE customer SET ";
    if(req.headers.email)
    {
        sql_string += "email = '" + req.headers.email + "', ";
    }
    if(req.headers.store_id)
    {
        sql_string += "store_id = " + req.headers.store_id + ", "; 
    }
    if(req.headers.first_name)
    {
        sql_string += "first_name = '" + req.headers.first_name + "', ";
    }
    if(req.headers.last_name)
    {
        sql_string += "last_name = '" + req.headers.last_name + "', ";
    }
    if(req.headers.address_id)
    {
        sql_string += "address_id = " + req.headers.address_id + ", ";
    }
    sql_string = sql_string.substring(0, sql_string.length - 2) /* Remove the final comma and space at the end */

    sql_string += " WHERE customer_id = " + req.headers.customer_id + " AND active = TRUE;";

    con.query(sql_string, 
    function (err, result, fields) {
        if (err) 
            throw err;

        res.status(200).send({
            failure: 0,
            message: 'Customer information updated.',
        })
    });

    });
    });
    });
})
app.post("/delete_customer", (req, res) => {
    /*Input sanitization*/
    if(!req.headers.customer_id)
    {
        res.status(200).send({
            failure: 1,
            message: 'Customer ID is needed to delete the customer.'
        })
        return;
    }
    if(!/^[0-9]*$/.test(req.headers.customer_id))
    {
        res.status(200).send({
            failure: 1,
            message: 'Customer ID needs to be a number.'
        })
        return;
    }
    /*Verify that the customer exists*/
    value_count_in_column("customer", "customer_id", req.headers.customer_id).then( function(customer_count){
    if(customer_count == 0)
    {
        res.status(200).send({
            failure: 1,
            message: 'Customer does not exist.',
        })
        return;
    }
    get_value_where("customer", "customer_id", req.headers.customer_id, "active").then( function(customer_is_active){
    if(customer_is_active == 0)
    {
        res.status(200).send({
            failure: 1,
            message: 'Customer does not exist.',
        })
        return;
    }
    
    var sql_string = "";
    sql_string = "UPDATE customer SET active = 0 WHERE customer_id = " + req.headers.customer_id + ";";
    con.query(sql_string, 
    function (err, result, fields) {
        if (err) 
            throw err;

        res.status(200).send({
            failure: 0,
            message: 'Customer deleted.'
        })
    });

    });
    });
})