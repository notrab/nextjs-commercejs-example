import Link from "next/link";

import commercejs from "../lib/commercejs";

export async function getStaticProps() {
  const { data: categories } = await commercejs.categories.list();

  return {
    props: {
      categories,
    },
  };
}

export default function CategoriesPage({ categories }) {
  return (
    <React.Fragment>
      <h1>Categories</h1>

      <ul>
        {categories.map((product) => (
          <li key={product.slug}>
            <Link href={`/categories/${product.slug}`}>
              <a>{product.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
