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
    '2021-08-06T17:01:17.194Z',
    '2021-08-10T23:36:17.929Z',
    '2021-08-14T10:51:36.790Z',
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

// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,

// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

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

let currentAccount, timer;

const now = new Date();

const dateToString = now.toLocaleDateString('en-us', {
  year: 'numeric',
  day: 'numeric',
  month: 'short',
  minute: 'numeric',
  hour: 'numeric',
});

const dateToISOString = now.toISOString();

const transactionDate = timestamp =>
  new Date(timestamp).toLocaleDateString('en-us', {
    year: 'numeric',
    day: 'numeric',
    month: 'short',
  });

const formatMovementDate = date => {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(date, new Date());

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return transactionDate(date);
};

// create usernames
const createUsernames = accounts => {
  accounts.forEach(account => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const startLogoutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const secs = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${secs}`;

    if (time <= 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };

  let time = 5 * 60;
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

const resetTimer = () => {
  if (timer) clearInterval(timer);
  timer = startLogoutTimer();
};

createUsernames(accounts);

// formatter to display currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// display each movments
const displayMovements = (account, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${index + 1} ${type}
          </div>
          <div class="movements__date">${formatMovementDate(
            new Date(account.movementsDates[index])
          )}</div>
          <div class="movements__value">${formatter.format(movement)}</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// update ui
const updateUI = account => {
  displayMovements(account);
  calceDisplayBalance(account);
  calcDisplaySummary(account);
  inputLoginUsername.value = inputLoginPin.value = '';
};

// calculate and display balance
const calceDisplayBalance = account => {
  account.balance = account.movements.reduce((acc, movement) => {
    return (acc += movement);
  }, 0);

  labelBalance.textContent = `${formatter.format(account.balance)}`;
};

// calculate and display summary
const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);

  labelSumIn.textContent = formatter.format(incomes);

  const out = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);

  labelSumOut.textContent = formatter.format(Math.abs(out));

  const interests = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = formatter.format(interests);
};

// Event Handlers

// Login button event listner
btnLogin.addEventListener('click', event => {
  event.preventDefault();

  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    resetTimer();

    updateUI(currentAccount);

    containerApp.style.opacity = 100;

    labelDate.textContent = dateToString;
  }
  inputLoginUsername.blur();
  inputLoginPin.blur();
});

// transfering account
btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.userName === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    transferAmount > 0 &&
    receiverAccount &&
    currentAccount.balance >= transferAmount &&
    receiverAccount.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementsDates.push(dateToISOString);
    receiverAccount.movements.push(transferAmount);
    receiverAccount.movementsDates.push(dateToISOString);

    resetTimer();
    updateUI(currentAccount);
  }
});

// loan
btnLoan.addEventListener('click', event => {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(dateToISOString);

    resetTimer();
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// sorting
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// closing account
btnClose.addEventListener('click', event => {
  event.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    if (index >= 0) {
      accounts.splice(index, 1);
      containerApp.style.opacity = 0;
    }
  }

  inputClosePin.value = inputCloseUsername.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const deposits = movements => {
  movements.filter(movement => {
    return movement > 0;
  });
};

const withdrawals = movements => {
  movements.filter(movement => {
    return movement < 0;
  });
};

const balance = movements => {
  movements.reduce((acc, movement) => {
    return (acc += movement);
  }, 0);
};

/////////////////////////////////////////////////
