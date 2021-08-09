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

let currentAccount;

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

createUsernames(accounts);

// formatter to display currency
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'JPY',
});

// display each movments
const displayMovements = movements => {
  containerMovements.innerHTML = '';

  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${index + 1} ${type}
          </div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${formatter.format(movement)}</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// update ui
const updateUI = account => {
  displayMovements(currentAccount.movements);
  calceDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
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

    containerApp.style.opacity = 100;

    updateUI(currentAccount);
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
    receiverAccount.movements.push(transferAmount);
    updateUI(currentAccount);
  }
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
  inputCloseUsername.blur();
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
