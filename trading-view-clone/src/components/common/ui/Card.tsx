import React from 'react';
import { Card as ShadcnCard } from '@/components/ui/card';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <ShadenCard className="p-4">{children}</ShadenCard>;
};