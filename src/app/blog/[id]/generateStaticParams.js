// This file contains the generateStaticParams function for the blog dynamic route
export async function generateStaticParams() {
  // Return an array of objects with the dynamic parameter values
  return [
    { id: "environment-protection" },
    { id: "language-learning-benefits" },
    { id: "cultural-exchange" },
    { id: "community-stories" },
    { id: "global-awareness" },
  ];
}
