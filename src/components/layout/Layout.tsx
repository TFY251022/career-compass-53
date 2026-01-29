import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CareerGuide from '@/components/career-guide/CareerGuide';
import DevStateToggles from '@/components/debug/DevStateToggles';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CareerGuide />
      <DevStateToggles />
    </div>
  );
};

export default Layout;
