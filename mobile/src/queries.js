import gql from 'graphql-tag';

const exampleQuery = gql`
{
  gauge(lat: 40, lng: -75) {
    id
    siteName
    temperature {
      timestamp
      reading
    }
  }
}
`;

export default exampleQuery;
