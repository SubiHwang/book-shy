import { FC } from 'react';
import { TabNavBarProps } from '@/types/common';
import { NavLink } from 'react-router-dom';

const TabNavBar: FC<TabNavBarProps> = ({ pages }) => {
  return (
    <div className="tab-nav flex w-full border-b border-gray-200 relative h-12">
      {pages.map((page) => (
        <NavLink
          key={page.path}
          to={page.path}
          className={({ isActive }) =>
            `flex-1 text-center py-3 text-lg transition-all relative ${
              isActive
                ? 'text-primary font-bold after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[3px] after:bg-primary'
                : 'text-light-text-muted hover:opacity-70'
            }`
          }
          end={true}
        >
          {page.label}
        </NavLink>
      ))}
    </div>
  );
};

export default TabNavBar;
