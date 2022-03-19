import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
{
    getPosts {
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
        public
    }
}
`

export const FETCH_USER_MONTH_POSTS_QUERY = gql`
    query getUserMonthPosts($year: String!, $month: String!) {
        getUserMonthPosts(year: $year, month: $month) {
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
            public
        }
    }
`

export const SEARCH_TAG = gql`
    query searchTag($tag: String!) {
        searchTag(tag: $tag) {
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

export const FETCH_USER_PROGRESS = gql`
{
    getUserProgress
}
`