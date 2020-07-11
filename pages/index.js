import Link from "next/link";

import commercejs from "../lib/commercejs";
import ProductList from "../components/ProductList";

export async function getStaticProps() {
  const merchant = await commercejs.merchants.about();
  const { data: categories } = await commercejs.categories.list();
  const { data: products } = await commercejs.products.list();

  return {
    props: {
      merchant,
      categories,
      products,
    },
  };
}

export default function IndexPage({ merchant, categories, products }) {
  return (
    <React.Fragment>
      <h1>{merchant.business_name}</h1>

      <h3>Categories</h3>

      <ul>
        {categories.map(({ name, slug }) => (
          <li key={slug}>
            <Link href={`/categories/${slug}`}>
              <a>{name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <h3>Products</h3>

      <ProductList products={products} />
    </React.Fragment>
  );
}
