import React, { useState } from "react";

const AdminCustomers: React.FC = () => {
  // Sample data for customers
  const customers = [
    {
      name: "Josephine Zimmerman",
      date: "01.01.2024",
      email: "josephine.z@example.com",
    },
    {
      name: "Cecilia Harriet",
      date: "12.12.2023",
      email: "cecilia.h@example.com",
    },
    {
      name: "Dennis Thomas",
      date: "15.11.2023",
      email: "dennis.t@example.com",
    },
    {
      name: "Lula Neal",
      date: "18.10.2023",
      email: "lula.n@example.com",
    },
    {
      name: "Jeff Montgomery",
      date: "25.09.2023",
      email: "jeff.m@example.com",
    },
    {
      name: "Michael Scott",
      date: "11.01.2024",
      email: "michael.s@example.com",
    },
    {
      name: "Pam Beesly",
      date: "21.10.2023",
      email: "pam.b@example.com",
    },
    {
      name: "Jim Halpert",
      date: "15.09.2023",
      email: "jim.h@example.com",
    },
    {
      name: "Dwight Schrute",
      date: "05.12.2023",
      email: "dwight.s@example.com",
    },
    {
      name: "Angela Martin",
      date: "10.11.2023",
      email: "angela.m@example.com",
    },
    {
      name: "Stanley Hudson",
      date: "18.10.2023",
      email: "stanley.h@example.com",
    },
    {
      name: "Kelly Kapoor",
      date: "30.08.2023",
      email: "kelly.k@example.com",
    },
    {
      name: "Toby Flenderson",
      date: "22.07.2023",
      email: "toby.f@example.com",
    },
    {
      name: "Ryan Howard",
      date: "04.05.2023",
      email: "ryan.h@example.com",
    },
    {
      name: "Oscar Martinez",
      date: "09.03.2024",
      email: "oscar.m@example.com",
    },
    {
      name: "Phyllis Vance",
      date: "20.02.2024",
      email: "phyllis.v@example.com",
    },
    {
      name: "Toby Flenderson",
      date: "22.07.2023",
      email: "toby.f@example.com",
    },
    {
      name: "Ryan Howard",
      date: "04.05.2023",
      email: "ryan.h@example.com",
    },
    {
      name: "Oscar Martinez",
      date: "09.03.2024",
      email: "oscar.m@example.com",
    },
    {
      name: "Phyllis Vance",
      date: "20.02.2024",
      email: "phyllis.v@example.com",
    },
    {
      name: "Toby Flenderson",
      date: "22.07.2023",
      email: "toby.f@example.com",
    },
    {
      name: "Ryan Howard",
      date: "04.05.2023",
      email: "ryan.h@example.com",
    },
    {
      name: "Oscar Martinez",
      date: "09.03.2024",
      email: "oscar.m@example.com",
    },
    {
      name: "Phyllis Vance",
      date: "20.02.2024",
      email: "phyllis.v@example.com",
    },
    {
      name: "Toby Flenderson",
      date: "22.07.2023",
      email: "toby.f@example.com",
    },
    {
      name: "Ryan Howard",
      date: "04.05.2023",
      email: "ryan.h@example.com",
    },
    {
      name: "Oscar Martinez",
      date: "09.03.2024",
      email: "oscar.m@example.com",
    },
    {
      name: "Phyllis Vance",
      date: "20.02.2024",
      email: "phyllis.v@example.com",
    },
    {
      name: "Toby Flenderson",
      date: "22.07.2023",
      email: "toby.f@example.com",
    },
    {
      name: "Ryan Howard",
      date: "04.05.2023",
      email: "ryan.h@example.com",
    },
    {
      name: "Oscar Martinez",
      date: "09.03.2024",
      email: "oscar.m@example.com",
    },
    {
      name: "Phyllis Vance",
      date: "20.02.2024",
      email: "phyllis.v@example.com",
    },
    {
      name: "Toby Flenderson",
      date: "22.07.2023",
      email: "toby.f@example.com",
    },
    {
      name: "Ryan Howard",
      date: "04.05.2023",
      email: "ryan.h@example.com",
    },
    {
      name: "Oscar Martinez",
      date: "09.03.2024",
      email: "oscar.m@example.com",
    },
    {
      name: "Phyllis Vance",
      date: "20.02.2024",
      email: "phyllis.v@example.com",
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const totalPages = Math.ceil(customers.length / customersPerPage);

  // Get current customers for the page
  const currentCustomers = customers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full">
      {/* Customer List */}
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Customer List</h3>

        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-100 rounded-t-xl font-extrabold bricolage-grotesque">
                <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold rounded-tr-xl">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors duration-150 poppins"
                >
                  <td className="flex items-center space-x-4 p-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <p className="font-semibold">{customer.name}</p>
                  </td>
                  <td className="p-4 text-sm">{customer.email}</td>
                  <td className="p-4 text-base font-semibold">
                    {customer.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-end mt-4 poppins">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mr-2 ${
              currentPage === 1 ? "bg-gray-300" : "bg-brand-neutral"
            } text-white rounded-lg`}
          >
            Previous
          </button>

          {currentPage > 3 && (
            <>
              <button className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg">
                1
              </button>
              <span className="px-4 py-2">...</span>
            </>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (pageNumber) =>
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
            )
            .map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-4 py-2 ${
                  currentPage === pageNumber
                    ? "bg-brand-neutral text-white "
                    : "bg-white border border-border-primary text-text-primary"
                }  mx-1 rounded-lg`}
              >
                {pageNumber}
              </button>
            ))}

          {currentPage < totalPages - 2 && (
            <>
              <span className="px-4 py-2">...</span>
              <button
                onClick={() => paginate(totalPages)}
                className="px-4 py-2 bg-white border border-border-primary text-text-primary rounded-lg"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 ml-2 ${
              currentPage === totalPages ? "bg-gray-300" : "bg-brand-neutral"
            } text-white rounded-lg`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
