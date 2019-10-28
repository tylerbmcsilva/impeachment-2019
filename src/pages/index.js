import Layout           from '../components/layout'
import SEO              from '../components/seo'
import React            from 'react';
import rehypeReact      from 'rehype-react';
import Tweet            from '../components/tweet';
import { Button }       from 'semantic-ui-react';
import { Container }    from 'semantic-ui-react';
import { graphql }      from 'gatsby';
import { Grid }         from 'semantic-ui-react';
import { Input }        from 'semantic-ui-react';
import { Form }         from 'semantic-ui-react';
import { Loader }       from 'semantic-ui-react';
import { Timeline }     from 'vertical-timeline-component-for-react';
import { TimelineItem } from 'vertical-timeline-component-for-react';
import { useState }     from 'react';


const render = new rehypeReact({
  createElement: React.createElement,
  components: {
    'tweet': Tweet
  }
}).Compiler;


export default function IndexPage({ data }) {
  const { allMarkdownRemark }               = data;
  const { edges }                           = allMarkdownRemark;
  const [ newestFirst, setNewestFirst ]     = useState(true);
  const [ searchResults, setSearchResults ] = useState([]);
  const [ searchTerm, setSearchTerm ]       = useState('');
  const [ isLoaded, setIsLoaded ]           = useState(false);

  function handleSearchTermChange(e) {
    setSearchTerm(e.target.value);
  }

  React.useEffect(() => {
    const results = edges.filter(({ node: { html, frontmatter } }) => (
      html.toLowerCase().includes(searchTerm.toLowerCase()) || frontmatter.title.toLowerCase().includes(searchTerm.toLowerCase())
    ));
    setSearchResults(results);
    setIsLoaded(true);
  }, [ searchTerm, edges ]);

  return (
    <Layout>
      <SEO title="Home" />
      { !isLoaded && <Loader active inline='centered'/>}
      { isLoaded && (
        <Container>
          <Form>
            <Grid>
              <Grid.Column computer={12} tablet={12} mobile={8}>
                <Form.Field>
                  <label>Search</label>
                  <Input
                    size="mini"
                    icon="search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    autoComplete={false}
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column computer={4} tablet={4} mobile={8}>
                <Form.Field>
                  <label style={{ textAlign: 'left' }}>Sort</label>
                  <Button.Group size="mini">
                    <Button size="mini" color="red" basic={!newestFirst}  onClick={() => setNewestFirst(true)}>Newest</Button>
                    <Button size="mini" color="red" basic={newestFirst} onClick={() => setNewestFirst(false)}>Oldest</Button>
                  </Button.Group>
                </Form.Field>
              </Grid.Column>
            </Grid>
          </Form>
          {searchResults.length > 0 && (
            <Timeline className={newestFirst ? null : 'reverse'} lineColor={'#ddd'} animate={false}>
              {searchResults.map(({ node }) => {
                return (
                  <TimelineItem
                    key={node.id}
                    id={node.frontmatter.date}
                    dateText={node.frontmatter.title}
                    dateInnerStyle={{ background: '#B71C1C', color: '#FFF' }}
                    style={{ color: '#B71C1C' }}>
                    {render(node.htmlAst)}
                  </TimelineItem>
                );
              })}
            </Timeline>
          )}
            {searchResults.length === 0 && (
              <p style={{ textAlign: 'center' }}>No Results</p>
            )}
        </Container>
      )}
    </Layout>
  );
}


export const query = graphql`
  query {
    allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
      edges {
        node {
          id
          frontmatter {
            date
            path
            title
            subtitle
          }
          html
          htmlAst
        }
      }
    }
  }
`;
