import React, { useEffect, useMemo, useState } from 'react';

function parseAnimatedValue(value) {
  const text = String(value);
  const match = text.match(/[+-]?\d[\d,]*(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const rawNumber = match[0];
  const numericValue = Number(rawNumber.replace(/,/g, ''));

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return {
    prefix: `${text.slice(0, match.index)}${
      rawNumber.startsWith('+') ? '+' : ''
    }`,
    suffix: text.slice(match.index + rawNumber.length),
    value: numericValue,
    decimals: rawNumber.includes('.') ? rawNumber.split('.')[1].length : 0,
    group: rawNumber.includes(',')
  };
}

function formatNumber(value, decimals, group) {
  const fixedValue = value.toFixed(decimals);
  const [integerPart, decimalPart] = fixedValue.split('.');
  const formattedInteger = group
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : integerPart;

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export function AnimatedValue({ value, duration = 900 }) {
  const parts = useMemo(() => parseAnimatedValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(() => String(value));

  useEffect(() => {
    if (!parts) {
      setDisplayValue(String(value));
      return undefined;
    }

    let frameId = 0;
    const startTime = performance.now();
    const target = parts.value;
    const start = target < 0 ? 0 : 0;
    const easeOut = progress => 1 - Math.pow(1 - progress, 3);

    const tick = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = start + (target - start) * easeOut(progress);
      setDisplayValue(
        `${parts.prefix}${formatNumber(
          current,
          parts.decimals,
          parts.group
        )}${parts.suffix}`
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [duration, parts, value]);

  return displayValue;
}
