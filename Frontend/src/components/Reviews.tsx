import React, { useContext, useEffect, useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import { Review } from "../lib/types";
import { AuthContext } from "../context/AuthContext/AuthContext";
import Axios from "axios";
import { URL } from "../lib/constants";
import { toast } from "sonner";

interface ReviewsProps {
  // currentReviews: Review[];
  id: string;
}

const Reviews: React.FC<ReviewsProps> = ({ id }) => {
  const { user } = useContext(AuthContext);
  const [change, setChange] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("oldest");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await Axios.get(
        `${URL}/products/collections/product/${id}`
      );
      setReviews(response.data.product.reviews);
    };
    fetchData();
  }, [id]);

  const [newReview, setNewReview] = useState<Review>({
    name: "",
    rating: 0,
    comment: "",
    date: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const today = new Date().toISOString();
    setReviews([...reviews, { ...newReview, date: today }]);

    try {
      const response = await Axios.post<any>(
        `${URL}/products/collections/product/${id}/reviews`,
        { ...newReview, date: today, user: user ? user.id : null }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setNewReview({
          name: "",
          rating: 0,
          comment: "",
          date: "",
        });
      }
    } catch (err) {
      toast.error("Something wrong. Couldn't submit review!");
    }
  };

  const sortReviews = () => {
    let sortedReviews = [...reviews];
    if (sortOption === "highest") {
      sortedReviews = sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "lowest") {
      sortedReviews = sortedReviews.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === "latest") {
      sortedReviews = sortedReviews.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortOption === "oldest") {
      sortedReviews = sortedReviews.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
    return sortedReviews;
  };

  return (
    reviews && (
      <>
        <div className="flex gap-2">
          <h3
            className="border border-border-secondary px-5 py-3 text-xs sm:text-sm cursor-pointer rounded-md"
            onClick={() => setChange(false)}
          >
            Click To Write A Review
          </h3>
          <p
            className="border border-border-secondary px-5 py-3 text-xs sm:text-sm cursor-pointer rounded-md"
            onClick={() => setChange(true)}
          >
            All Reviews ({reviews?.length})
          </p>
        </div>

        {change ? (
          <div className="mx-auto rounded-lg mt-10">
            {reviews?.length > 0 ? (
              <>
                <div className="mb-6 sm:mb-4">
                  <h2 className="text-2xl font-bold mb-4">All Reviews</h2>
                  <div className="w-full md:w-1/2 mt-1">
                    <Select onValueChange={setSortOption}>
                      <SelectTrigger className="rounded-md">
                        <SelectValue placeholder="Sort Reviews" />
                      </SelectTrigger>
                      <SelectContent className=" bg-background-light rounded-lg border border-border-secondary">
                        <SelectItem
                          value="all"
                          className=" cursor-pointer hover:text-text-secondary
                      "
                        >
                          All
                        </SelectItem>
                        <SelectItem
                          value="highest"
                          className=" cursor-pointer  hover:text-text-secondary"
                        >
                          Highest Rating
                        </SelectItem>
                        <SelectItem
                          value="lowest"
                          className=" cursor-pointer  hover:text-text-secondary"
                        >
                          Lowest Rating
                        </SelectItem>
                        <SelectItem
                          value="latest"
                          className=" cursor-pointer  hover:text-text-secondary"
                        >
                          Latest
                        </SelectItem>
                        <SelectItem
                          value="oldest"
                          className=" cursor-pointer  hover:text-text-secondary"
                        >
                          Oldest
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <ul>
                  {sortReviews().map((review, index) => (
                    <li
                      key={index}
                      className="mb-6 border-b border-border-secondary pb-4"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg">{review.name}</h3>
                        <div className="flex gap-2">
                          <p className="text-sm text-gray-500 ">
                            <div className="flex gap-2">
                              <p className="text-sm text-gray-500 ">
                                {review?.date?.split("").slice(0, 10)}
                              </p>
                              <p className="text-sm text-gray-500 ">
                                {review?.date?.split("").slice(11, 19)}
                              </p>
                            </div>
                          </p>
                        </div>
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
              </>
            ) : (
              <p className="text-gray-500">
                No reviews yet. Be the first to write one!
              </p>
            )}
          </div>
        ) : (
          <div className="mx-auto shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">Customer Review</h2>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="mb-8 poppins">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none"
                  required
                  min="1"
                  max="5"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none"
                  rows={4}
                  required
                ></textarea>
              </div>

              <Button className="rounded-md bg-brand-neutral border-none poppins text-white max-sm:w-full">
                Submit Review
              </Button>
            </form>
          </div>
        )}
      </>
    )
  );
};

export default Reviews;
