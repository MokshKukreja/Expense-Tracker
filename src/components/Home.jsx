import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

function Home() {

    const initialTransaction = []
    const [transactions, setTransactions] = useState(initialTransaction);

    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")

    const income = transactions
        .filter((transaction) => transaction.amount > 0)
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
        .filter((transaction) => transaction.amount < 0)
        .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income + expense;

    const getTransactions = async () => {
        const response = await fetch(`http://localhost:8000/fetchtransactions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json()
        setTransactions(json)
    }
    const addTransactions = async (description, amount) => {
        const response = await fetch(`http://localhost:8000/addtransactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, amount })
        });

        const transaction = await response.json();
        setTransactions(transactions.concat(transaction))
    }

    const deleteTransactions = async (id) => {
        const response = await fetch(`http://localhost:8000/deletetransactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const json = response.json();
        console.log(json);
        const updatedTransactions = transactions.filter(
            (transaction) => transaction._id !== id
        );
        setTransactions(updatedTransactions);
    }


    useEffect(() => {
        getTransactions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        addTransactions(description, amount)
        setDescription("");
        setAmount("");
    }

    return (
        <div className=" d-flex justify-content-center" style={{ backgroundColor: "#ccc", height: "100%", width: "100%" }}>

            <div className="">

                <h1 className="py-5">Expense Tracker</h1>
                <div className='pb-3'>
                    <h3>Your Balance</h3>
                    <h4>{balance}</h4>
                </div>

                <div className="container text-center bg-white shadow-sm mb-5 ">

                    <div className="row">
                        <div className="col m-4 ">
                            Income
                            <div className="text-success">{income}</div>
                        </div>
                        <div className="col m-4 ">
                            Expense
                            <div className="text-danger">{expense * -1}</div>
                        </div>
                    </div>
                </div>


                <h3 className='my-3'>History</h3>

                <div className="container text-center" style={{ width: "300px" }}>
                    <div className="row row-cols-1">
                        {transactions.map((transaction, index) => (
                            <div
                                className="col d-flex justify-content-between bg-white shadow-sm p-2 my-2"
                                key={index}
                            >
                                <div>{transaction.description}</div>
                                <div className='d-flex gap-3   '>
                                    <div className={transaction.amount > 0 ? "text-success" : "text-danger"}>{transaction.amount}</div>
                                    <AiOutlineClose className='pe-auto mt-1 opacity-50' onClick={() => deleteTransactions(transaction._id)} />
                                </div>

                            </div>
                        ))}
                    </div>
                </div>


                <h3 className='my-3'>Add new transaction</h3>


                <form className='mb-5 pb-5'>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Description</label>
                        <input type="text" className="form-control" placeholder='Enter Description..' name='description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Amount</label>
                        <input type="text" className="form-control" placeholder='Enter amount..' name='amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <button type="submit" onClick={handleSubmit} className="btn btn-primary my-4 w-100">Add transaction</button>
                </form>
            </div>

        </div>
    );
}

export default Home;
