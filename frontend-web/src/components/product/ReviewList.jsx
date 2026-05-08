import { Star } from 'lucide-react'
import { format } from 'date-fns'

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to review this product!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {review.user_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium">{review.user_name || 'Anonymous'}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {review.created_at && format(new Date(review.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
