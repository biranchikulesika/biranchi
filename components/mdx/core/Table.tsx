import { HTMLAttributes } from 'react';

export const Table = ({ children, ...props }: HTMLAttributes<HTMLTableElement>) => {
  return (
    <div className="my-10 overflow-x-auto w-full">
      <table className="w-full text-left border-collapse text-[16px] md:text-[18px]" {...props}>
        {children}
      </table>
    </div>
  );
};

export const Th = ({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th className="py-3 px-4 font-normal uppercase text-xs tracking-widest text-primary border-b border-border" {...props}>
      {children}
    </th>
  );
};

export const Td = ({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className="py-3 px-4 font-light border-b border-border border-dashed last:border-0" {...props}>
      {children}
    </td>
  );
};
