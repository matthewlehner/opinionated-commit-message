import * as inspection from '../inspection';

it('reports no errors on correct message.', () => {
  const message =
    'Change SomeClass to OtherClass\n' +
    '\n' +
    'This replaces the SomeClass with OtherClass in all of the module \n' +
    'since Some class was deprecated.';

  const errors = inspection.check(message);
  expect(errors).toEqual([]);
});

it('reports too few lines.', () => {
  const message = 'Change SomeClass to OtherClass';
  const errors = inspection.check(message);
  expect(errors).toEqual([
    'Expected at least three lines (subject, empty, body), but got: 1'
  ]);
});

it('reports on missing empty line between subject and body.', () => {
  const message =
    'Change SomeClass to OtherClass\n' +
    '---\n' +
    'This replaces the SomeClass with OtherClass in all of the module \n' +
    'since Some class was deprecated.';

  const errors = inspection.check(message);
  expect(errors).toEqual([
    'Expected an empty line between the subject and the body, ' +
      'but got a second line of length: 3'
  ]);
});

it('reports the subject starting with a non-capitalized word.', () => {
  const message =
    'SomeClass to OtherClass\n' +
    '\n' +
    'This replaces the SomeClass with OtherClass in all of the module \n' +
    'since Some class was deprecated.';

  const errors = inspection.check(message);
  expect(errors).toEqual([
    'The subject must start with a capitalized verb (e.g., "Change").'
  ]);
});

it('reports the subject starting with a non-verb.', () => {
  const message =
    'Replaced SomeClass to OtherClass\n' +
    '\n' +
    'This replaces the SomeClass with OtherClass in all of the module \n' +
    'since Some class was deprecated.';

  const errors = inspection.check(message);
  expect(errors.length).toBe(1);
  expect(errors[0].startsWith('The subject must start in imperative mood'));
});

it('reports the subject ending in a dot.', () => {
  const message =
    'Change SomeClass to OtherClass.\n' +
    '\n' +
    'This replaces the SomeClass with OtherClass in all of the module \n' +
    'since Some class was deprecated.';

  const errors = inspection.check(message);
  expect(errors).toEqual(["The subject must not end with a dot ('.')."]);
});

it('reports too long a body line.', () => {
  const message =
    'Change SomeClass to OtherClass\n' +
    '\n' +
    'This replaces the SomeClass with OtherClass in all of the module ' +
    'since Some class was deprecated.';

  const errors = inspection.check(message);
  expect(errors).toEqual([
    'The line 3 of the message (line 1 of the body) exceeds ' +
      'the limit of 72 characters.'
  ]);
});

it('reports body that does not start with a word.', () => {
  const message = 'Change SomeClass to OtherClass\n\n* Do something';

  const errors = inspection.check(message);
  expect(errors).toEqual(['The body must start with a capitalized word.']);
});

it('reports duplicate starting word in subject and body.', () => {
  const message =
    'Change SomeClass to OtherClass\n' +
    '\n' +
    'Change SomeClass so that OtherClass does not conflict..';

  const errors = inspection.check(message);
  expect(errors).toEqual([
    'The first word of the subject must not match the first word of the body.'
  ]);
});
