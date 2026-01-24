// This file contains the generateStaticParams function for the community dynamic route
export async function generateStaticParams() {
  // Return an array of objects with the dynamic parameter values
  return [
    { id: "user1" },
    { id: "user2" },
    { id: "user3" },
    { id: "user4" },
    { id: "user5" },
  ];
}
