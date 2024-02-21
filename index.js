const express = require("express"); //include express in this app
const path = require("path"); //module to help with file paths
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");

// configure dotenv to use the env variables
dotenv.config();

const app = express(); // create a express app
const port = process.env.PORT || "8888"; // get port or add default port
const DB_URL = `mongodb+srv://product_user:xxttss10@cluster0.gfi1ben.mongodb.net` // get db url from env

// connect to the database url
const client = new MongoClient(DB_URL);

//views folder
app.set("views", path.join(__dirname,"views")); //set up "views" setting to look in the <__dirname>/
app.set("view engine", "ejs"); // set up app to use ejs as template engine

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public"))); // configure the views folder for rendering the views

//set up for data parsing easily
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());


//RENDER THE HOME PAGE
app.get("/", (req,res) => {
    res.render("pages/index");
});

app.get("/products", async (req, res) => {
    const products = await getAllProducts();// get all products 
    res.render("pages/products", { products });
});

app.get('/add-product', (req, res) => {
    res.render('pages/addProduct');
});

app.post('/add-product', async (req, res) => {
    const { name, price, description } = req.body;
    const newProduct = await addProduct({
      name,
      price,
      description,
    });
    res.redirect('/products');
});

app.listen(port, () =>{
    console.log(`Listening on http://localhost:${port}`)
});

//MongoDB FUNCTIONS
async function connection() {
    db = client.db("comp_ecommerce");
    return db;
}

// Function to select all products from the database
async function getAllProducts() {
    db = await connection();
    let results = db.collection("products").find({});
    let res = await results.toArray();
    return res;
}

//Function to add a new product to the database
async function addProduct(newProdcut) {
    db = await connection();
    await db.collection("products").insertOne(newProdcut);
}
