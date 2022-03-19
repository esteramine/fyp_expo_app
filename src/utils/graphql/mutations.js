import gql from "graphql-tag";

export const CREATE_POST = gql`
    mutation createPost(
        $image: String!
        $foodName: String!
        $completion: String!
        $ateTime: String!
        $price: String!
        $restaurantName: String!
        $location: String!
        $rating: String!
        $review: String!
        $tags: [String]
        $public: Boolean!
    ) {
        createPost(
            postInput: {
                image:$image
                foodName:$foodName
                completion:$completion
                ateTime:$ateTime
                price:$price
                restaurantName:$restaurantName
                location:$location
                rating:$rating
                review:$review
                tags:$tags
                public: $public
            }
        ) {
            id 
            image
            foodName
            createdAt
            username

            completion
            ateTime
            price
            restaurantName
            location
            rating
            review
            tags
            public

            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                username
                body
                createdAt
            } 
        }
    }
`

export const EDIT_POST = gql`
    mutation editPost(
        $postId: ID!
        $postInput: PostInput
    ) {
        editPost(
            postId: $postId,
            postInput: $postInput
        ) {
            id 
            image
            foodName
            createdAt
            username

            completion
            ateTime
            price
            restaurantName
            location
            rating
            review
            tags
            public

            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                username
                body
                createdAt
            } 
        }
    }
`

export const DELETE_POST = gql`
    mutation deletePost(
        $postId: ID!
    ) {
        deletePost(postId: $postId) 
    }
`

export const LIKE_POST = gql`
    mutation likePost(
        $postId: ID!
    ) {
        likePost(postId: $postId) {
            likeCount
        }
    }
`

export const COMMENT_POST = gql`
    mutation createComment(
        $postId: ID!,
        $body: String!
    ){
        createComment(postId: $postId, body: $body) {
            commentCount
            comments {
                id
                username
                body
                createdAt
            }
        }
    }
`

export const DELETE_POST_COMMENT = gql`
    mutation deleteComment(
        $postId: ID!,
        $commentId: ID!
    ){
        deleteComment(postId: $postId, commentId: $commentId) {
            commentCount
            comments {
                id
                username
                body
                createdAt
            }
        }
    }
`