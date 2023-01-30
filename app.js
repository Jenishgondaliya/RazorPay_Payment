require("dotenv").config();

const crypto = require("crypto")
const express = require("express");
const Razorpay = require("razorpay"); 

const razorpayInstance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
const PORT = process.env.PORT || "5000";

app.post("/createOrder", (req, res) => {
  // STEP 1:
  const { amount, currency, receipt, notes } = req.body;

  // STEP 2:
  razorpayInstance.orders.create(
    { amount, currency, receipt, notes },
    (err, order) => {
      //STEP 3 & 4:
      if (!err) res.json(order);
      else res.send(err);
    }
  );
});

//Inside app.js
app.post('/verifyOrder', (req, res)=>{
	
	// STEP 7: Receive Payment Data
	const {order_id, payment_id} = req.body;	
	const razorpay_signature = req.headers['x-razorpay-signature'];


	let hmac = crypto.createHmac('sha256', process.env.key_secret);

	hmac.update(order_id + "|" + payment_id);
	
	const generated_signature = hmac.digest('hex');
	
	
	if(razorpay_signature===generated_signature){
		res.json({success:true, message:"Payment has been verified"})
	}
	else
	res.json({success:false, message:"Payment verification failed"})
});




app.listen(PORT, () => {
  console.log("Server is Listening on Port ", PORT);
});