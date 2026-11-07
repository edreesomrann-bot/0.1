import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canTransitionStatus,
  calculateEstimatedArrivalMinutes,
  formatETA,
} from './bookingState';

test('state machine allows craftsman to accept requested booking', () => {
  const result = canTransitionStatus('requested', 'accepted', 'craftsman');
  assert.equal(result.allowed, true);
});

test('state machine forbids skipping from requested to completed', () => {
  const result = canTransitionStatus('requested', 'completed', 'craftsman');
  assert.equal(result.allowed, false);
});

test('state machine permits customer to cancel while still in requested state', () => {
  const result = canTransitionStatus('requested', 'cancelled', 'customer');
  assert.equal(result.allowed, true);
});

test('state machine prevents customer from cancelling once craftsman is en_route', () => {
  const result = canTransitionStatus('en_route', 'cancelled', 'customer');
  assert.equal(result.allowed, false);
});

test('ETA calculation computes reasonable arrival time with buffer', () => {
  // 15 km at 30 km/h = 30 minutes + 4 min buffer = 34 min
  const eta = calculateEstimatedArrivalMinutes(15, 30);
  assert.equal(eta, 34);

  // 0 km or negative returns 0
  assert.equal(calculateEstimatedArrivalMinutes(0), 0);
});

test('formatETA formats localized strings correctly', () => {
  assert.equal(formatETA(0, 'ar'), 'وصل الآن');
  assert.equal(formatETA(0, 'en'), 'Arrived now');
  assert.equal(formatETA(15, 'ar'), '15 دقيقة');
  assert.equal(formatETA(15, 'en'), '15 mins');
});
