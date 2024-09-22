import React, { useContext, useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { Button } from "@relume_io/relume-ui";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const Reviews: React.FC = () => {
  const [change, setChange] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([
    {
      name: "John Doe",
      rating: 5,
      comment: "Amazing product! Highly recommend.",
      date: "September 21, 2024",
    },
    {
      name: "Jane Smith",
      rating: 4,
      comment: "Great quality but shipping was a bit slow.",
      date: "September 20, 2024",
    },
  ]);

  const { user } = useContext(AuthContext);

  const [newReview, setNewReview] = useState<Omit<Review, "date">>({
    name: "",
    rating: 0,
    comment: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setReviews([
      ...reviews,
      { ...newReview, name: user.username, date: today },
    ]);
    setNewReview({ name: "", rating: 0, comment: "" });
  };
  return (
    <>
      <div className="flex gap-2">
        <h3
          className="border px-5 py-3 text-sm cursor-pointer rounded-md"
          onClick={() => setChange(false)}
        >
          Write your Reviews
        </h3>
        <p
          className="border px-5 py-3 text-sm cursor-pointer rounded-md"
          onClick={() => setChange(true)}
        >
          All Reviews ({reviews.length})
        </p>
      </div>
      {change ? (
        <div className="mx-auto  shadow-md rounded-lg mt-10">
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review, index) => (
                <li key={index} className="mb-6 border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 text-xl mr-2">
                      {"★".repeat(review.rating)}
                    </span>
                    <span className="text-gray-400 text-xl">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No reviews yet. Be the first to write one!
            </p>
          )}
        </div>
      ) : (
        <div className="mx-auto  shadow-md rounded-lg mt-10">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                name="rating"
                value={newReview.rating}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value={0}>Select Rating</option>
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Comment
              </label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                required
              ></textarea>
            </div>
            {/* <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              Submit Review
            </button> */}
            <Button className="rounded-md">Submit Review</Button>
          </form>
        </div>
      )}
    </>
  );
};

export default Reviews;

// const WriteReviews = () => {
//   return (
//     <div className="w-full flex flex-col">
//       <select name="" id="">
//         <option value="">good</option>
//       </select>

//       <input type="text" />
//     </div>
//   );
// };

// Define types for the review object

// const ReviewSection: React.FC = () => {
//   return (

//   );
// };
