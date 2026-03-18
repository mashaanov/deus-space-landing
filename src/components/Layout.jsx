import React from 'react';

const Layout = ({ children }) => {
  return (
    <>
      <main className="pt-20 md:pt-24">
        {children}
      </main>
    </>
  );
};

export default Layout;