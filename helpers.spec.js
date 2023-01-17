const {
  flattenArr,
  dataFetcher,
  sortList,
  formatCurrency,
  handlePromises
} = require('./helpers.js');
const axios = require('axios');

jest.mock('axios');

describe('flattenArr', () => {
  it('return a non-nested arr', () => {
    const input = [1, 2, 3, 4];
    const expectedOutput = [1, 2, 3, 4];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });

  it('flattens a nested arr', () => {
    const input = [1, 2, 3, [4, 5, [6, 7, [8, [9, [10]]]]]];
    const expectedOutput = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });

  it('flattens an empty arr', () => {
    const input = [];
    const expectedOutput = [];

    expect(flattenArr(input)).toEqual(expectedOutput);
  })
  
});

describe('dataFetcher', () => {
  it('handles a successful response', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: { users: [] } }));

    const data = await dataFetcher();

    expect(data).toEqual({ data: { users: [] } });
  });

  it('handles an error response', async () => {
    axios.get.mockImplementation(() => Promise.reject('Boom'));

    try {
      await dataFetcher();
    } catch (e) {
      expect(e).toEqual(new Error({ error: 'Boom', message: 'An Error Occurred' }));
    }
  });
});

describe('sortList', () => {
  it('calls a sorter function if it is available', () => {
    const sortFn = jest.fn();

    sortList([3, 2, 1], sortFn);

    expect(sortFn).toBeCalled();
    expect(sortFn).toBeCalledTimes(1);
    expect(sortFn.mock.calls).toEqual([[[3, 2, 1]]]);
  });

  it('does not call a sorter function if the array has a length <= 1', () => {
    const sortFn = jest.fn();

    sortList([1], sortFn);

    expect(sortFn).not.toBeCalled();
    expect(sortFn).toBeCalledTimes(0);

    sortList([], sortFn);

    expect(sortFn).not.toBeCalled();
    expect(sortFn).toBeCalledTimes(0);

  });

  it('returns the array if no function is passed in', () => {
    expect(sortList([1])).toEqual([1]);
    expect(sortList([1,2,3])).toEqual([1,2,3]);
  })
});

/**
 * Add you test/s here and get this helper file to 100% test coverage!!!
 * You can check that your coverage meets 100% by running `npm run test:coverage`
 */

describe('formatCurrency', () => {
  it('returns $0.00 if input is not a number (NaN)', () => {
    
    expect(formatCurrency("test")).toEqual("$0.00")
    expect(formatCurrency({test: "not number"})).toEqual("$0.00")
    expect(formatCurrency(NaN)).toEqual("$0.00")
    expect(formatCurrency(undefined)).toEqual("$0.00")
    expect(formatCurrency([1, 2, 3])).toEqual("$0.00")
    
  });

  it('returns formatted currency if !NaN', () => {
    
    expect(formatCurrency(5)).toEqual("$5.00")
    expect(formatCurrency(3.5)).toEqual("$3.50")
    expect(formatCurrency(6.813)).toEqual("$6.81")
    expect(formatCurrency(0.1)).toEqual("$0.10")
    
  });
});

describe('handlePromises', () => {
  it('returns data array if resolved', async () => {
    let tasks = []
    axios.get.mockImplementation(() => Promise.resolve([tasks]));

    const data = await handlePromises([tasks]);

    expect(data).toEqual([tasks]);
  });
  it('returns throws an error if promise is rejected', async () => {
    let tasks = []
    axios.get.mockImplementation(() => Promise.reject("Big fat nope"));

    try{
      await handlePromises([tasks]);
    } catch(e){
      expect(e).toEqual(new Error({error: "Big fat nope"}));
    }
  });
});
