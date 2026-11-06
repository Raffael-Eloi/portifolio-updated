import React from 'react';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Raffael Eloi</p>
      </footer>
    </div>
  );
};

export default MainLayout;
