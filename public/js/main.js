// Define contract paramenters

var web3;
var PriceGeneratorABI;
var UniPGStablecoinABI;
var PriceGeneratorAddress;
var UniPGStablecoinAddress;
var PriceGeneratorMinter;
var UniPGStablecoinMinter;
var wallets;
var PriceGenerator;
var UniPGStablecoin;

async function createContractParams(){

    const testnet = 'http://localhost:8545';
    console.log('Connecting to ' + testnet);
    web3 = new Web3(new Web3.providers.HttpProvider(testnet));
    console.log('Web3: ');
    console.log(web3);

    // Test the connection

    web3.eth.net.getId().then((data)=>{
        console.log('Net Id:' + data); 
    });
    web3.eth.getBlock('latest').then((data)=>{
        console.log('Lastest Block: ');
        console.log(data); 
    });
    web3.eth.getBlockNumber().then((data)=>{
        console.log('Block Number:' + data); 
    });

    // Get ABI from the Truffle build

    d3.json('./TruffleTest/build/contracts/PriceGenerator.json')
        .then((data) => {
            PriceGeneratorABI = data.abi;
            console.log('Price Generator ABI: ');
            console.log(PriceGeneratorABI);
        });
    
    d3.json('./TruffleTest/build/contracts/UniPGStablecoin.json')
        .then((data) => {
            UniPGStablecoinABI = data.abi;
            console.log('UniPG Stablecoin ABI: ')
            console.log(UniPGStablecoinABI);
        });

    // Get contract address from Ganache
    // This is done explicitly to show blockchain interaction, but the minter of both accounts is always the first account in Ganache

    let FirstBlockHash = await web3.eth.getBlock('1');
    let PriceGeneratorDeployment = await web3.eth.getTransactionReceipt(FirstBlockHash.transactions[0]);
    console.log(PriceGeneratorDeployment);
    PriceGeneratorAddress = PriceGeneratorDeployment.contractAddress
    PriceGeneratorMinter = PriceGeneratorDeployment.from;
    console.log('Price Generator contract address: ');
    console.log(PriceGeneratorAddress);
    console.log('Price Generator contract owner: ');
    console.log(PriceGeneratorMinter);

    let SecondBlockHash = await web3.eth.getBlock('2');
    let UniPGStablecoinDeployment = await web3.eth.getTransactionReceipt(SecondBlockHash.transactions[0]);
    console.log(UniPGStablecoinDeployment);
    UniPGStablecoinAddress = UniPGStablecoinDeployment.contractAddress
    UniPGStablecoinMinter = UniPGStablecoinDeployment.from;
    console.log('UniPG Stablecoin contract address: ');
    console.log(UniPGStablecoinAddress);
    console.log('UniPG Stablecoin contract owner: ');
    console.log(UniPGStablecoinMinter);

    // Get the wallets
    // This can be done using web3, but since Ganache is used, the wallets are stored inside /public/data/keys.json
    
    /*
    wallets = await web3.eth.getAccounts().then((data)=>{  
        console.log('Accounts: ' + data);
        return data;
    });*/

    wallets = await d3.json('./public/data/keys.json')
        .then((data)=>{
            console.log('Accounts: ')
            console.log(data);
            return data;
        });

    // Display information on the page

    displayBlocks();
    
    // let blockhtml = document.getElementById("blocks");
    // let blockBatch = await displayBlocks();
    // console.log('BlocksBatch: ');
    // console.log(blockBatch);
    // console.log();
    // .then((data)=>{
    //     console.log('Blocks: ');
    //     console.log(data);
    //     console.log(typeof(data));
    //     return data;
    // });

    displayTransactions();
    
    var addresshtml = document.getElementById("contract-address");
    addresshtml.innerHTML = "<b>Price Generator contract address: </b>" + PriceGeneratorAddress + "<br><b>UniPG Stablecoin contract address: </b>" + UniPGStablecoinAddress;  
    
    var minterhtml = document.getElementById("contract-owner");
    minterhtml.innerHTML = "<b>Price Generator contract owner: </b>" + PriceGeneratorMinter + "<br><b>UniPG Stablecoin contract owner: </b>" + UniPGStablecoinMinter;  

    var n = document.getElementById("wallet-list");
    console.log('Addresses: ');
    console.log(wallets.addresses);
    let i = 0;
    for(let address in wallets.addresses){
       n.innerHTML += "<p class=\"row\"> " + i.toString() +"): " + wallets.addresses[address] + "</p>";
       i++;
    }

    let j=0;
    var m = document.getElementById("private-keys");
    console.log('Private keys: ');
    console.log(wallets.private_keys);
    for(let key in wallets.private_keys){
        m.innerHTML += "<p class=\"row\"> " + j.toString() +"): " + wallets.private_keys[key] + "</p>";
        j++;
    }   
}

createContractParams();

// Draw the charts

createCoinChart();

createTokenChart();

async function displayBlocks(){
    
    let blockhtml = document.getElementById("blocks");
    let latestBlock = await web3.eth.getBlockNumber();
    console.log('Latest block number: ');
    console.log(latestBlock);

    let blockrange = 10;
    
    for (let i = 0; i < blockrange; i++) {
        let temp = Number(latestBlock)-i;
        if (temp < 0){
            break;
        }else{
            web3.eth.getBlock(temp).then((data)=>{
                //console.log(data);
                //blocks.push(data);
                blockhtml.innerHTML += data.hash + "<br>";
            })
        }
    } 
}

async function displayTransactions(){
    
}

// Interaction methods

async function getTokenName(){
    var n = document.getElementById("token-name");
    if(UniPGStablecoin == undefined){
        UniPGStablecoin = new web3.eth.Contract(UniPGStablecoinABI, UniPGStablecoinAddress);
    }
    UniPGStablecoin.methods.name().call().then((data)=>{
        console.log(data)
        n.innerHTML = " &emsp;" + data ;
    });
}

async function getTokenSymbol(){
    var n = document.getElementById("token-symbol");
    if(UniPGStablecoin == undefined){
        UniPGStablecoin = new web3.eth.Contract(UniPGStablecoinABI, UniPGStablecoinAddress);
    }
    UniPGStablecoin.methods.symbol().call().then((data)=>{
        console.log(data)
        n.innerHTML = " &emsp;" + data ;
    });
}

async function getTokenDecimals(){
    var n = document.getElementById("token-decimals");
    if(UniPGStablecoin == undefined){
        UniPGStablecoin = new web3.eth.Contract(UniPGStablecoinABI, UniPGStablecoinAddress);
    }
    UniPGStablecoin.methods.decimals().call().then((data)=>{
        console.log(data)
        n.innerHTML = " &emsp;" + data ;
    });
}

async function getTotalSupply(){
    var n = document.getElementById("token-total-supply");
    if(UniPGStablecoin == undefined){
        UniPGStablecoin = new web3.eth.Contract(UniPGStablecoinABI, UniPGStablecoinAddress);
    }
    UniPGStablecoin.methods.totalSupply().call().then((data)=>{
        console.log(data)
        n.innerHTML = " &emsp;" + data ;
    });
}

async function getPrice(){
    var n = document.getElementById("token-price");
    if (PriceGenerator == undefined){
        PriceGenerator = new web3.eth.Contract(PriceGeneratorABI, PriceGeneratorAddress);
    }
    PriceGenerator.methods.price().call().then((data)=>{
        console.log(data)
        n.innerHTML = " &emsp;" + data/BigInt(1e18) + " Euro";
    });
}

async function getBalance(){
    var n = document.getElementById("wallet-balance");
    var account = document.getElementById("user-wallet").value;
    console.log(account);
    if (UniPGStablecoin == undefined){
        UniPGStablecoin = new web3.eth.Contract(UniPGStablecoinABI, UniPGStablecoinAddress);
    }
    UniPGStablecoin.methods.balanceOf(account).call().then((data)=>{
        console.log(data)
        n.innerHTML = " &emsp;" + data;
    });
}


async function getAllowance(){
    
}

async function mintTokens(){
    var minter = document.getElementById("user-wallet").value;
    var account = document.getElementById("target-wallet").value;
    var amount = document.getElementById("token-amount").value;
    if (UniPGStablecoin == undefined){
        UniPGStablecoin = new web3.eth.Contract(UniPGStablecoinABI, UniPGStablecoinAddress);
    }

    // since this method changes the state of the contract, it requires a signed transaction
    var gasAmount = await UniPGStablecoin.methods.mint(account, amount).estimateGas({from: minter});
    console.log("Gas amount is " + gasAmount);
    var gasPrice = await web3.eth.getGasPrice();
    console.log("Gas price is " + gasPrice);
    if(minter != UniPGStablecoinMinter){
        console.log("You are not the owner of this contract");
        alert("You are not the owner of this contract");
        return;
    }
    
    const privateKey = wallets.private_keys[minter];
    var transaction = {
        'from': minter,
        'to': UniPGStablecoinAddress,
        'gas': gasAmount,
        'gasPrice': gasPrice,
        'data': UniPGStablecoin.methods.mint(account, amount).encodeABI(),
    };
    web3.eth.accounts.signTransaction(transaction, privateKey).then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction, function(error, hash) {
            if (!error) {
                console.log("The hash of your transaction is: ", hash);
            } else {
                console.log("Something went wrong while submitting your transaction:", error)
            }
        })
    });
}

async function transferTokens(){
    var from = document.getElementById("from-wallet").value;
    var to = document.getElementById("to-wallet").value;
    var amount = document.getElementById("transfer-amount").value;
    if (UniPGStablecoin == undefined){
        UniPGStablecoin = new web3.eth.Contract(UniPGStablecoinABI, UniPGStablecoinAddress);
    }

    // since this method changes the state of the contract, it requires a signed transaction
    var gasAmount = await UniPGStablecoin.methods.transfer(to, amount).estimateGas({from: from});
    console.log("Gas amount is " + gasAmount);
    var gasPrice = await web3.eth.getGasPrice();
    console.log("Gas price is " + gasPrice);
    
    const privateKey = wallets.private_keys[from];
    var transaction = {
        'from': from,
        'to': UniPGStablecoinAddress,
        'gas': gasAmount,
        'gasPrice': gasPrice,
        'data': UniPGStablecoin.methods.transfer(to, amount).encodeABI(),
    };
    web3.eth.accounts.signTransaction(transaction, privateKey).then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction, function(error, hash) {
            if (!error) {
                console.log("The hash of your transaction is: ", hash);
            } else {
                console.log("Something went wrong while submitting your transaction:", error)
            }
        })
    });
}


async function createWallet(){

    var n = document.getElementById("wallet-creation");
    var password = document.getElementById("user-password").value;
    var wallet = await web3.eth.accounts.create(password);
    
    console.log('New wallet: ');
    console.log(wallet);
    n.innerHTML = " Wallet created: ";
    n.innerHTML += "<p class=\"row\"> " + wallet.address + "</p>";
    n.innerHTML += "<p class=\"row\"> " + wallet.privateKey + "</p>";

    console.log('Old wallets: ');
    console.log(wallets['addresses']);
    wallets.addresses = JSON.parse(JSON.stringify(wallets['addresses']).slice(0, -1) + ', "' + wallet.address + '":"' + wallet.address + '"}');
    console.log('New wallets: ')
    console.log(wallets['addresses']);
    
    console.log('Old private keys: ');
    console.log(wallets['private_keys']);
    wallets.private_keys = JSON.parse(JSON.stringify(wallets['private_keys']).slice(0, -1) + ', "' + wallet.address + '":"' + wallet.privateKey + '"}');
    console.log('New private keys: ');
    console.log(wallets['private_keys']);

    // check if it saves the wallets
}