
// // export default Layout
// import React from 'react';
// import { Children } from 'react';
// import Header from './Header';
// import Footer from './Footer';

// const Layout = ({ children }) => {
//     return (
//         <div className="flex flex-col min-h-screen overflow-hidden">
//             <Header />
//             <main className="flex-grow w-full">
//                 <div className="w-full">
//                     <div className="main w-full">
//                         {Children.toArray(children)}
//                     </div>
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default Layout;


import React from 'react';
import Header from './Header';
import Footer from './Footer';
const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden bg-gray-50">
            <Header />
            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 mt-2">
                {children}
            </main>
            <Footer />
        </div>
    );
};
export default Layout;
