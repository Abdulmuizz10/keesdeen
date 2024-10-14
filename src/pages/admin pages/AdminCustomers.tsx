import React from "react";

const AdminCustomers: React.FC = () => {
  // Sample data for customers
  const customers = [
    {
      name: "Josephine Zimmerman",
      status: "active",
      date: "01.01.2024",
      email: "josephine.z@example.com",
    },
    {
      name: "Cecilia Harriet",
      status: "inactive",
      date: "12.12.2023",
      email: "cecilia.h@example.com",
    },
    {
      name: "Dennis Thomas",
      status: "active",
      date: "15.11.2023",
      email: "dennis.t@example.com",
    },
    {
      name: "Lula Neal",
      status: "pending",
      date: "18.10.2023",
      email: "lula.n@example.com",
    },
    {
      name: "Jeff Montgomery",
      status: "active",
      date: "25.09.2023",
      email: "jeff.m@example.com",
    },
    {
      name: "Michael Scott",
      status: "inactive",
      date: "11.01.2024",
      email: "michael.s@example.com",
    },
    {
      name: "Pam Beesly",
      status: "active",
      date: "21.10.2023",
      email: "pam.b@example.com",
    },
    {
      name: "Jim Halpert",
      status: "active",
      date: "15.09.2023",
      email: "jim.h@example.com",
    },
    {
      name: "Dwight Schrute",
      status: "inactive",
      date: "05.12.2023",
      email: "dwight.s@example.com",
    },
    {
      name: "Angela Martin",
      status: "pending",
      date: "10.11.2023",
      email: "angela.m@example.com",
    },
    {
      name: "Stanley Hudson",
      status: "active",
      date: "18.10.2023",
      email: "stanley.h@example.com",
    },
    {
      name: "Kelly Kapoor",
      status: "inactive",
      date: "30.08.2023",
      email: "kelly.k@example.com",
    },
    {
      name: "Toby Flenderson",
      status: "active",
      date: "22.07.2023",
      email: "toby.f@example.com",
    },
    {
      name: "Ryan Howard",
      status: "pending",
      date: "04.05.2023",
      email: "ryan.h@example.com",
    },
    {
      name: "Oscar Martinez",
      status: "active",
      date: "09.03.2024",
      email: "oscar.m@example.com",
    },
    {
      name: "Phyllis Vance",
      status: "inactive",
      date: "20.02.2024",
      email: "phyllis.v@example.com",
    },
  ];

  return (
    <div className="w-full">
      {/* Customer List */}
      <div className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold mb-4">Customer List</h3>

        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-100 rounded-t-xl font-extrabold">
                <th className="text-left p-4 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold rounded-tr-xl">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="flex items-center space-x-4 p-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <span className="font-semibold">{customer.name}</span>
                  </td>
                  <td className="p-4 text-sm">{customer.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${
                        customer.status === "active"
                          ? "bg-green-200 text-green-800"
                          : customer.status === "inactive"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{customer.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
