'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

const printAccountTransactions = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movements =
    sort === true
      ? acc.movements.slice().sort((first, second) => first - second)
      : acc.movements;

  movements.forEach((transaction, index) => {
    const typeofTransaction = transaction > 0 ? 'deposit' : 'withdrawal';

    const data = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeofTransaction}">
          ${index + 1} ${typeofTransaction}
        </div>
        <div class="movements__value">${transaction.toFixed(2)}</div>
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

  labelBalance.textContent = `${account.balance.toFixed(2)} EUR`;
};

////////// Display summary

const displaySummary = function (account) {
  const sumIn = account.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumIn.textContent = `${sumIn.toFixed(2)}EUR`;

  const sumOut = account.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumOut.textContent = `${Math.abs(sumOut).toFixed(2)}EUR`;

  const sumInterest = account.movements
    .filter(el => el > 0)
    .map(interest => (interest * account.interestRate) / 100)
    .filter(banana => banana >= 1)
    .reduce((acc, el) => acc + el, 0);
  labelSumInterest.textContent = `${sumInterest.toFixed(2)}EUR`;
};

//Update UI

const updateUI = function (acc) {
  //Display account movements

  printAccountTransactions(acc);

  //Display balance

  displayBalance(acc);

  //Display summary bottom

  displaySummary(acc);
};

// Event handler

let loggedAccount;

//Fake logg in

loggedAccount = account1;
updateUI(loggedAccount);
containerApp.style.opacity = 100;

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
    //Delete account using splice
    const index = accounts.findIndex(
      account => account.username === loggedAccount.username
    );
    accounts.splice(index, 1);

    //Hide UI

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputLoginPin.value = '';
});

//Request loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loggedAccount.movements.some(mov => mov >= loanAmount * 0.1) &&
    loanAmount > 0
  ) {
    //Add loan
    loggedAccount.movements.push(loanAmount);

    updateUI(loggedAccount);
  }
  inputLoanAmount.value = '';
});

let sortState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  printAccountTransactions(loggedAccount, !sortState);
  sortState = !sortState;
});
