const { ljust, rjust } = require('../index');

describe('ljust with strings', () => {
  test('empty string', () => {
    const str = ljust('', 5);

    expect(str).toBe('     ');
  });

  test('empty string with no width specified', () => {
    const str = ljust('');

    expect(str).toBe('');
  });

  test('space padding', () => {
    const str = ljust('one', 5);

    expect(str).toBe('one  ');
  });

  test('character padding', () => {
    const str = ljust('two', 7, 'x');

    expect(str).toBe('twoxxxx');
  });

  test('No padding required', () => {
    const str = ljust('three', 5);

    expect(str).toBe('three');
  });

  test('No space for padding', () => {
    const str = ljust('four', 3);

    expect(str).toBe('four');
  });
});

describe('ljust with integers', () => {
  test('space padding', () => {
    const str = ljust(999, 5);

    expect(str).toBe('999  ');
  });

  test('character padding', () => {
    const str = ljust(4867, 7, 'x');

    expect(str).toBe('4867xxx');
  });

  test('No padding required', () => {
    const str = ljust(789, 3);

    expect(str).toBe('789');
  });

  test('No space for padding', () => {
    const str = ljust(7890, 3);

    expect(str).toBe('7890');
  });
});

describe('ljust with non-integers', () => {
  test('space padding', () => {
    const str = ljust(999.8, 7);

    expect(str).toBe('999.8  ');
  });

  test('character padding', () => {
    const str = ljust(4867.3, 7, 'x');

    expect(str).toBe('4867.3x');
  });

  test('No padding required', () => {
    const str = ljust(789.5, 5);

    expect(str).toBe('789.5');
  });

  test('No space for padding', () => {
    const str = ljust(7890.123, 6);

    expect(str).toBe('7890.123');
  });
});

describe('rjust with strings', () => {
  test('empty string', () => {
    const str = rjust('', 4);

    expect(str).toBe('    ');
  });

  test('empty string with no width specified', () => {
    const str = rjust('');

    expect(str).toBe('');
  });

  test('space padding', () => {
    const str = rjust('one', 5);

    expect(str).toBe('  one');
  });

  test('character padding', () => {
    const str = rjust('two', 7, 'x');

    expect(str).toBe('xxxxtwo');
  });

  test('No padding required', () => {
    const str = rjust('three', 5);

    expect(str).toBe('three');
  });

  test('No space for padding', () => {
    const str = rjust('four', 3);

    expect(str).toBe('four');
  });
});

describe('rjust with integers', () => {
  test('space padding', () => {
    const str = rjust(999, 5);

    expect(str).toBe('  999');
  });

  test('character padding', () => {
    const str = rjust(4867, 7, 'x');

    expect(str).toBe('xxx4867');
  });

  test('No padding required', () => {
    const str = rjust(7890, 3);

    expect(str).toBe('7890');
  });

  test('No space for padding', () => {
    const str = rjust(78901, 3);

    expect(str).toBe('78901');
  });
});

describe('rjust with non-integers', () => {
  test('space padding', () => {
    const str = rjust(999.87, 7);

    expect(str).toBe(' 999.87');
  });

  test('character padding', () => {
    const str = rjust(486.3, 7, 'x');

    expect(str).toBe('xx486.3');
  });

  test('No padding required', () => {
    const str = rjust(789.58, 6);

    expect(str).toBe('789.58');
  });

  test('No space for padding', () => {
    const str = rjust(7890.1234, 7);

    expect(str).toBe('7890.1234');
  });
});
