'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
let timer;

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2022-01-24T10:17:24.185Z',
    '2022-01-20T14:11:59.604Z',
    '2022-01-21T17:01:17.194Z',
    '2022-01-22T23:36:17.929Z',
    '2022-01-23T10:51:36.790Z',
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

const formatDate = function (date, locale) {
  const difference = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const dayPassed = difference(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const printAccountTransactions = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movements =
    sort === true
      ? acc.movements.slice().sort((first, second) => first - second)
      : acc.movements;

  movements.forEach((transaction, index) => {
    const typeofTransaction = transaction > 0 ? 'deposit' : 'withdrawal';

    const transactionDate = new Date(acc.movementsDates[index]);
    const outputDate = formatDate(transactionDate, acc.locale);

    const internationalTransaction = formatCurrency(
      transaction,
      acc.locale,
      acc.currency
    );

    const data = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeofTransaction}">
          ${index + 1} ${typeofTransaction}
        </div>
        <div class="movements__date">${outputDate}</div>
        <div class="movements__value">${internationalTransaction}</div>
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
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

////////// Display summary

const displaySummary = function (account) {
  const sumIn = account.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el, 0);

  labelSumIn.textContent = formatCurrency(
    sumIn,
    account.locale,
    account.currency
  );

  const sumOut = account.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el, 0);

  labelSumOut.textContent = formatCurrency(
    sumOut,
    account.locale,
    account.currency
  );

  const sumInterest = account.movements
    .filter(el => el > 0)
    .map(interest => (interest * account.interestRate) / 100)
    .filter(banana => banana >= 1)
    .reduce((acc, el) => acc + el, 0);
  labelSumInterest.textContent = formatCurrency(
    sumInterest,
    account.locale,
    account.currency
  );
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

//Log out

const loggOutTimer = function () {
  let time = 100;

  const timerFunction = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${minutes}:${seconds}`;
    //1 sec decrease
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  timerFunction();
  const timer = setInterval(timerFunction, 1000);

  return timer;
};
// Event handler

let loggedAccount;

// const year = now.getFullYear();
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const day = `${now.getDate()}`.padStart(2, 0);
// const hour = `${now.getHours()}`.padStart(2, 0);
// const minutes = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

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

    //Display date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      loggedAccount.locale,
      options
    ).format(now);

    if (timer) clearInterval(timer);
    timer = loggOutTimer();
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

    loggedAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    updateUI(loggedAccount);

    //Reset timer
    clearInterval(timer);
    timer = loggOutTimer();
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
    setTimeout(function () {
      //Add loan
      loggedAccount.movements.push(loanAmount);
      loggedAccount.movementsDates.push(new Date().toISOString());

      updateUI(loggedAccount);

      //Reset timer
      clearInterval(timer);
      timer = loggOutTimer();
    }, 2000);
  }
  inputLoanAmount.value = '';
});

let sortState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  printAccountTransactions(loggedAccount, !sortState);
  sortState = !sortState;
});
