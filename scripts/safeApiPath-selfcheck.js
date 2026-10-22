import { assertSafeApiPath, isNumericMediaId } from '../src/lib/safeApiPath.js';

assertSafeApiPath('/movie/550');
assertSafeApiPath('/search/multi');
try {
  assertSafeApiPath('https://evil.test/movie/1');
  throw new Error('expected throw');
} catch {
  // ok
}
try {
  assertSafeApiPath('/movie/../tv/1');
  throw new Error('expected throw');
} catch {
  // ok
}
if (!isNumericMediaId('123') || isNumericMediaId('abc')) {
  throw new Error('isNumericMediaId self-check failed');
}
console.log('safeApiPath self-check ok');
