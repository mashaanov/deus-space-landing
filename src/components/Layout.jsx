import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <main className="pt-20 md:pt-20 min-h-screen bg-gradient-to-br">
        {children}
      </main>
    </>
  );
};

export default Layout;
