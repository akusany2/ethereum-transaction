const Web3 = require('web3')
var Tx = require('ethereumjs-tx').Transaction
const fs = require('fs');
const rl = require('readline');

const web3 = new Web3('https://ropsten.infura.io/v3/12dcb03dc253435d8e1574ccc307d796')

const primaryAccount = '0x3792155b5f01e2aFC304439FE41207EbCA91B823'

const privateKey1 = Buffer.from('c736b058165601f8f4e27622e1e95866780eae17856865c8919b53dcd4f3e966', 'hex')

const contractAddress = '0xc08b29da04d4aac5c3964dafde7c4b45fcbfe3af'

const contractABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "delegate",
        "type": "address"
      },
      {
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "buyer",
        "type": "address"
      },
      {
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenOwner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "receiver",
        "type": "address"
      },
      {
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "delegate",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "total",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "tokenOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "tokens",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress)


const getTransactionCount = async(account) => {
  return await web3.eth.getTransactionCount(account)
}

const sendTransaction = async(raw) => {
  return await web3.eth.sendSignedTransaction(raw)
}

const transferFunds = async(account1, account2, amount) => {

  let txCount = await getTransactionCount(account1)

  console.log("Transaction Count: " + txCount)

  const txObject = {
    nonce:    web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(100000), // uses about 36,000 gas so add some buffer
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
    to: contractAddress,
    data: contract.methods.transfer(account2, amount).encodeABI()
  }

  const tx = new Tx(txObject, {chain:'ropsten', hardfork: 'petersburg'})

  tx.sign(privateKey1)

  const serializedTx = tx.serialize()
  const raw = '0x' + serializedTx.toString('hex')

  console.log("Waiting for transaction to complete")

  let minedTransaction = await sendTransaction(raw)
  console.log("transaction hash returned: " + minedTransaction.transactionHash)

  return minedTransaction.transactionHash
}

// async methods
const getBalanceOf = async(account) => {
  let balanceOf = await contract.methods.balanceOf(account).call()
  return balanceOf
}

const executeTransfer = async (accountsArray) => {
  var txDetailsArray = [];
  // Get total tokens
  var totalTokens = await getBalanceOf(primaryAccount);

  // Calculate 5% of total tokens
  var tokensToDistribute = totalTokens * (5 / 100);

  // Tokens each account will get
  var tokens = tokensToDistribute / accountsArray.length

  var txHash;
  for(var account of accountsArray) {
    txHash = await transferFunds(primaryAccount, account, Math.floor(tokens))
    var balance = await getBalanceOf(account);
    txDetailsArray.push({
      balance,
      account,
      txHash
    })
  };
  return await txDetailsArray;
}

const extractFile = async (filePath, cb) => {
  var txArray = [];
  var lineReader = rl.createInterface({
    input: fs.createReadStream(filePath)
  });
  
  await lineReader.on('line', function (line) {
    if (line.length) {
      txArray.push(line.trim())
    }
  }).on('close', async () => {
    cb(await executeTransfer(txArray));
  })
}

module.exports = { transferFunds, getBalanceOf, extractFile, primaryAccount }


