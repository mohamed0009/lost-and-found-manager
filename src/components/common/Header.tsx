import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-start mb-8">
    <div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default Header; 