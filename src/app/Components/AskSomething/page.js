// "use client"
// import { useState } from 'react';
// import axios from 'axios';
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const CustomerSupport = () => {
//   const [query, setQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [response, setResponse] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setResponse('');

//     // Check availability in the database
//     let availabilityMessage = '';
//     try {
//       const { data } = await axios.get('/api/checkAvailability', { params: { query } });
       
//       if (data.available) {
//         availabilityMessage = `Yes, ${query} is available on our website.`;
//       } else {
//         availabilityMessage = `Sorry, ${query} is not available on our website.`;
//       }
//     } catch (error) {
//       console.error('Error checking availability:', error);
//       availabilityMessage = 'Sorry, we encountered an issue checking the availability. Please try again later.';
//     }

//     // Initialize the AI model
//     const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     try {
//       const prompt = `${availabilityMessage} Please respond concisely within 20 to 50 words.`;
//       const result = await model.generateContent([prompt]);

//       setResponse(result.response.text());
//     } catch (error) {
//       console.error('Error generating text:', error);
//       setResponse('An error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 border border-gray-300 rounded-lg mb-6">
//       <h2 className="text-2xl font-bold mb-4">Need Help Finding Something?</h2>
//       <form onSubmit={handleSubmit} className="w-full flex items-center space-x-4">
//         <input
//           type="text"
//           placeholder="Ask me anything..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//         />
//         <button
//           type="submit"
//           className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//         >
//           {isLoading ? 'Wait...' : 'Search'}
//         </button>
//       </form>

//       {response && (
//         <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50 w-full">
//           <p className="text-lg">{response}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerSupport;
