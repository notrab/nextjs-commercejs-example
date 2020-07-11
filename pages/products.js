import commercejs from "../lib/commercejs";

export async function getStaticProps() {
  const { data: products } = await commercejs.products.list();

  return {
    props: {
      products,
    },
  };
}

export default function ProductsPage({ products }) {
  return (
    <React.Fragment>
      <h1>Products</h1>

      <ProductList products={products} />
    </React.Fragment>
  );
}
