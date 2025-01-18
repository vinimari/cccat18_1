import express from "express";
import { Signup } from "./Signup";
import { AccountDAO } from "./AccountDAO";
import { GetAccount } from "./GetAccount";

const app = express();
app.use(express.json());
const accountDao = new AccountDAO();
const signup = new Signup(accountDao);
const getAccount = new GetAccount(accountDao);

app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    const output = await signup.execute(input);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/accounts/:accountId", async (req, res) => {
  const input = req.params.accountId;
  try {
    const output = await getAccount.execute(input);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.listen(3000);
