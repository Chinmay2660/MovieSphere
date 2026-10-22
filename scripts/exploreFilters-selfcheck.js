import assert from 'node:assert/strict';
import { buildDiscoverParams } from '../src/lib/exploreFilters.js';

const movieQ = buildDiscoverParams(false, {
  sortBy: 'vote_average.desc',
  genres: ['28'],
  year: '2024',
  minRating: '7',
  language: 'hi',
  country: 'IN',
}, 1);
assert.strictEqual(movieQ.primary_release_year, '2024');
assert.strictEqual(movieQ['vote_average.gte'], '7');
assert.strictEqual(movieQ.with_original_language, 'hi');
assert.strictEqual(movieQ.with_origin_country, 'IN');

const tvQ = buildDiscoverParams(true, {
  sortBy: 'popularity.desc',
  genres: [],
  year: '2020',
  minRating: '',
}, 2);
assert.strictEqual(tvQ['first_air_date.gte'], '2020-01-01');
assert.strictEqual(tvQ.page, 2);

console.log('exploreFilters self-check ok');
