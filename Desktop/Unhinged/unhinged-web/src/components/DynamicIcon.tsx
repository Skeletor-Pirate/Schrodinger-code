import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  className = '', 
  size = 20, 
  color 
}) => {
  // Safe cast since we know Icons is a module containing React components
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Fallback to standard HelpCircle if icon is not found
    const Fallback = Icons.HelpCircle;
    return <Fallback className={className} size={size} color={color} />;
  }

  return <IconComponent className={className} size={size} color={color} />;
};
