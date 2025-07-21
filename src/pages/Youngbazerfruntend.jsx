// import React, { useState } from 'react'
// import Layout from '../component/Layout'
// import axios from 'axios'

// const Youngbazerfruntend = () => {
//   const [frunted_youngbazer, setFruntedyoungbazer] = useState(0)
//   const [errorstatus, setErrorStatus] = React.useState(false)

//   const get_fruntend_youngbazer = async () => {

//     axios.get('http://202.143.125.148:9001/get_tickers')
//       .then((response) => {
//         // console.log("myfruntedyoungbazer", response)
//         console.log(response.status); // Output: 200

//         setFruntedyoungbazer(response.status)
//         setErrorStatus()

//       }).catch((error) => {
//         console.error("Error fetching fruntend youngbazer data:", error);
//       })


//   }
//   get_fruntend_youngbazer();

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-4">Young Bazer Health</h1>
//         <p className="text-lg mb-4">A health monitoring system for backend service status.</p>

//         <div className="overflow-x-auto mt-8">
//           <table className="min-w-full table-auto border-collapse bg-white border border-gray-200 shadow-sm text-sm text-gray-700">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-3 border text-left">S.No</th>
//                 <th className="px-4 py-3 border text-left">Service</th>
//                 <th className="px-4 py-3 border text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="hover:bg-gray-50">
//                 <td className="px-4 py-3 border">1</td>
//                 <td className="px-4 py-3 border">Young Bazer Fruntend</td>
//                 <td className="px-4 py-3 border font-semibold">
//                   <span
//                     className={`h-3 w-3 rounded-full inline-block ${errorstatus ? 'bg-red-500' : frunted_youngbazer === 200 ? 'bg-green-500' : 'bg-yellow-500'
//                       }`}
//                     title={hasError ? 'Error' : 'Online'}
//                   ></span>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </Layout>
//   )
// }

// export default Youngbazerfruntend


import React, { useState, useEffect } from 'react';
import Layout from '../component/Layout';
import axios from 'axios';

const Youngbazerfruntend = () => {
  const [frunted_youngbazer, setFruntedyoungbazer] = useState(0);
  const [errorstatus, setErrorStatus] = useState(false);

  const get_fruntend_youngbazer = async () => {
    try {
      const response = await axios.get('http://202.143.125.148:9001/get_tickers');
      setFruntedyoungbazer(response.status);
      setErrorStatus(false); // no error
    } catch (error) {
      console.error("Error fetching fruntend youngbazer data:", error);
      setErrorStatus(true); // error occurred
    }
  };

  useEffect(() => {
    get_fruntend_youngbazer();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Young Bazer Health</h1>
        <p className="text-lg mb-4">A health monitoring system for backend service status.</p>

        <div className="overflow-x-auto mt-8">
          <table className="min-w-full table-auto border-collapse bg-white border border-gray-200 shadow-sm text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border text-left">S.No</th>
                <th className="px-4 py-3 border text-left">Service</th>
                <th className="px-4 py-3 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3 border">1</td>
                <td className="px-4 py-3 border">Young Bazer Fruntend</td>
                <td className="px-4 py-3 border font-semibold">
                  <span
                    className={`h-3 w-3 rounded-full inline-block ${errorstatus
                      ? 'bg-red-500'
                      : frunted_youngbazer === 200
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                      }`}
                    title={
                      errorstatus
                        ? 'Error'
                        : frunted_youngbazer === 200
                          ? 'Online'
                          : 'Pending/Changed'
                    }
                  ></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Youngbazerfruntend;
