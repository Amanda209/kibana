/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { resolveDestinationLocation } from './utils';
import { ProcessorSelector } from '../../types';

const testBaseSelector = ['TEST'];

describe('Resolve destination location', () => {
  it('resolves to root level when dragged to top', () => {
    const testItems = [
      /* pos 0 -- this should displace item below, same with rest */
      ['processors', '0'],
      /* pos 1 */
      ['processors', '0', 'onFailure', '0'],
    ];
    const result = resolveDestinationLocation(
      testItems,
      0 /* corresponds to position 0, when dragging up */,
      testBaseSelector,
      'up'
    );
    expect(result).toEqual({ selector: ['processors'], index: 0 });
  });

  it('resolves to root level when dragged to bottom if source comes from root', () => {
    const testItems = [
      ['processors', '0'],
      ['processors', '1'],
      ['processors', '1', 'onFailure', '0'],
    ];
    const result1 = resolveDestinationLocation(
      testItems,
      testItems.length - 1,
      testBaseSelector,
      'down',
      testItems[0].length === 2
    );
    expect(result1).toEqual({ selector: ['processors'], index: testItems.length - 1 });
  });

  it('nests an element at the position it was placed', () => {
    const testItems = [
      ['processors', '0'],
      /* pos 0 -- this should displace item below, same with rest */
      ['processors', '0', 'onFailure', '0'],
      /* pos 1 */
      ['processors', '1'],
      /* pos 2 */
      ['processors', '1', 'onFailure', '0'],
      /* pos 3 */
      ['processors', '2'],
    ];
    const result2 = resolveDestinationLocation(
      testItems,
      2 /* corresponds to pos 2, when dragging down */,
      testBaseSelector,
      'down',
      false
    );
    expect(result2).toEqual({ selector: ['processors', '1', 'onFailure'], index: 0 });
  });

  it('handles special case of dragging to bottom with root level item', () => {
    const testItems = [
      ['processors', '0'],
      /* pos 0 -- this should displace item below, same with rest */
      ['processors', '0', 'onFailure', '0'],
      /* pos 1 */
      ['processors', '1'],
      /* pos 2 */
      ['processors', '1', 'onFailure', '0'],
      /* pos 3 */
      ['processors', '2'],
    ];
    const result2 = resolveDestinationLocation(
      testItems,
      3 /* corresponds to pos 3, when dragging down */,
      testBaseSelector,
      'down',
      true
    );
    expect(result2).toEqual({ selector: ['processors'], index: 2 });
  });

  it('sets the base selector if there are no items', () => {
    const testItems: ProcessorSelector[] = [];
    const result = resolveDestinationLocation(
      testItems,
      testItems.length - 1,
      testBaseSelector,
      'none'
    );
    expect(result).toEqual({ selector: testBaseSelector, index: 0 });
  });

  it('displaces the current item if surrounded by items at same level', () => {
    const testItems = [['0'], ['0', 'onFailure', '0'], ['0', 'onFailure', '1']];
    const result = resolveDestinationLocation(testItems, 1, testBaseSelector, 'up');
    expect(result).toEqual({ selector: ['0', 'onFailure'], index: 0 });
  });

  it('displaces bottom item if surrounding items are at different levels', () => {
    const testItems1 = [
      ['0'],
      /* pos 0 -- this should displace item below, same with rest */
      ['0', 'onFailure', '0'],
      /* pos 1 */
      ['0', 'onFailure', '1'],
      /* pos 2 */
      ['0', 'onFailure', '1', 'onFailure', '0'],
      /* pos 3 */
      ['0', 'onFailure', '1', 'onFailure', '1'],
      /* pos 4 */
    ];

    const result1 = resolveDestinationLocation(
      testItems1,
      2 /* corresponds to pos 2, when dragging from above */,
      testBaseSelector,
      'down'
    );
    expect(result1).toEqual({
      selector: ['0', 'onFailure', '1', 'onFailure'],
      index: 0,
    });

    const testItems2 = [
      ['0'],
      ['0', 'onFailure', '0'],
      ['0', 'onFailure', '1', 'onFailure', '0'],
      ['0', 'onFailure', '1', 'onFailure', '1'],
      ['0', 'onFailure', '2'],
      ['0', 'onFailure', '3'],
    ];

    const result2 = resolveDestinationLocation(testItems2, 3, testBaseSelector, 'down');
    expect(result2).toEqual({ selector: ['0', 'onFailure'], index: 2 });
  });

  it('throws for bad array data', () => {
    const testItems = [
      ['0'],
      ['0', 'onFailure' /* should end in a number! */],
      ['0', 'onFailure' /* should end in a number! */],
    ];
    expect(() => resolveDestinationLocation(testItems, 1, testBaseSelector, 'down')).toThrow(
      'Expected an integer but received "onFailure"'
    );
  });
});
