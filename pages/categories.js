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
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/categories/${category.slug}`}>
              <a>{category.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
