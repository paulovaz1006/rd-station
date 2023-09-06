/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */

function sortByScoreAscending(customerArray) {
  return customerArray.sort((a, b) => a.score - b.score)
  .map(item => ({...item,customers: []}))
}

function filterOutAwayCustomers(customerSuccess, customerSuccessAway) {
  if (customerSuccessAway.length === 0) return customerSuccess;
  const successAwaySet = new Set(customerSuccessAway);

  return customerSuccess.filter(customer => !successAwaySet.has(customer.id));
}

function searchCustomerSuccess(sortCustomerSuccess, customers) {
  const assignedCustomers = new Set();
  const defaultCustomerSuccessSelected = {
    id: 0,
    customers: []
  };
  let customerSuccessSelected = defaultCustomerSuccessSelected;

  for (const cs of sortCustomerSuccess) {
    const csScore = cs.score;

    for (const customer of customers) {
      if(customer.score <= csScore && !assignedCustomers.has(customer.id)) {
        assignedCustomers.add(customer.id)
        cs.customers.push(customer)

        if(cs.customers.length > customerSuccessSelected.customers.length) {
          customerSuccessSelected = cs
        }
      }
    }
  }

  const hasDuplicatedCS = sortCustomerSuccess.some(cs => {    
    return cs.customers.length === customerSuccessSelected.customers.length && cs.id !== customerSuccessSelected.id
  });

  if (hasDuplicatedCS) {
    customerSuccessSelected = defaultCustomerSuccessSelected
  }

  return customerSuccessSelected.id
}

function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  const customerSuccessActives = filterOutAwayCustomers(customerSuccess, customerSuccessAway)
  const sortCustomerSuccess = sortByScoreAscending(customerSuccessActives)  
  const customerSuccessSelected = searchCustomerSuccess(sortCustomerSuccess, customers)

  return customerSuccessSelected;
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

