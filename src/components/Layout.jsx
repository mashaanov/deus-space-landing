import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <main className="pt-20 md:pt-24 min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
        {children}
      </main>
    </>
  );
};

export default Layout;
