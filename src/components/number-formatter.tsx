import React from 'react';
import { NumericFormat } from 'react-number-format';

interface NumberFormatterProps {
  value: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const NumberFormatter: React.FC<NumberFormatterProps> = ({ value, ...props }) => {
  return <NumericFormat value={value} thousandSeparator displayType='text' {...props} />;
};

export default NumberFormatter;
