'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const printAccountTransactions = function (transactions) {
  containerMovements.innerHTML = '';

  transactions.forEach((transaction, index) => {
    const typeofTransaction = transaction > 0 ? 'deposit' : 'withdrawal';

    const data = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeofTransaction}">
          ${index + 1} ${typeofTransaction}
        </div>
        <div class="movements__value">${transaction}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', data);
  });
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////////////////////////////////// Compute usernames

const computeUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};

computeUsernames(accounts);

//////////// Display balance

const displayBalance = function (account) {
  account.balance = account.movements.reduce((acc, el) => acc + el, 0);

  labelBalance.textContent = `${account.balance} EUR`;
};

////////// Display summary

const displaySummary = function (account) {
  const sumIn = account.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumIn.textContent = `${sumIn}EUR`;

  const sumOut = account.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)}EUR`;

  const sumInterest = account.movements
    .filter(el => el > 0)
    .map(interest => (interest * account.interestRate) / 100)
    .filter(banana => banana >= 1)
    .reduce((acc, el) => acc + el, 0);
  labelSumInterest.textContent = `${sumInterest}EUR`;
};

//Update UI

const updateUI = function (acc) {
  //Display account movements

  printAccountTransactions(acc.movements);

  //Display balance

  displayBalance(acc);

  //Display summary bottom

  displaySummary(acc);
};

// Event handler

let loggedAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent from submitting

  e.preventDefault();

  //Log user
  loggedAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (loggedAccount?.pin === Number(inputLoginPin.value)) {
    //Clear inputs

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Display header message

    labelWelcome.textContent = `Welcome ${loggedAccount.owner
      .split(' ')
      .at(0)}!`;

    //Display container

    containerApp.style.opacity = 100;

    updateUI(loggedAccount);
  }
});

//Transfer Money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    receiverAccount &&
    amount > 0 &&
    amount <= loggedAccount.balance &&
    loggedAccount?.username !== receiverAccount.username
  ) {
    receiverAccount.movements.push(amount);
    loggedAccount.movements.push(-amount);
    updateUI(loggedAccount);
  }
});

//Delete Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    loggedAccount.username === inputCloseUsername.value &&
    loggedAccount.pin === Number(inputClosePin.value)
  ) {
    console.log('delete');
  }
});
