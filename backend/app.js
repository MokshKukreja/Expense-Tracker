const express = require('express')
const app = express()
const port = 8000
const mongoose = require("mongoose")
const bodyParser = require('body-parser');
const cors = require("cors")


app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/expense-tracker", () => {
    console.log("Connected successfully");
})
mongoose.set('strictQuery', true);



const TransactionSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }

})
const Transaction = new mongoose.model('transactions', TransactionSchema)

app.post("/addtransactions",async (req,res)=>{
    try {
        const transaction = new Transaction({
          description:req.body.description,
          amount:req.body.amount
        })
        const savedTransaction = await transaction.save()

        res.json(savedTransaction)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

app.get("/fetchtransactions",async(req,res)=>{
    try {
        const transactions = await Transaction.find(req.body.id);
        res.json(transactions)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

app.delete("/deletetransactions/:id",async (req,res)=>{
    try {
        let transaction = await Transaction.findById(req.params.id);
        if (!transaction) { return res.status(404).send("Not Found") }
        transaction = await Transaction.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Transaction has been deleted", transaction: transaction });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})