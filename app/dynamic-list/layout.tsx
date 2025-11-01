import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dynamic List - jQuery Task',
  description: 'Dynamic list with add and delete functionality',
};

export default function DynamicListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

