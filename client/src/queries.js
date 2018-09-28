import gql from 'graphql-tag';

const exampleQuery = gql`
    {
        rates(currency: "USD") {
            currency
        }
    }
`;

export default exampleQuery;
