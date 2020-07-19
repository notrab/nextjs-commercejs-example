import commerce from "../lib/commerce";
import CategoryList from "../components/CategoryList";

export async function getStaticProps() {
  const { data: categories } = await commerce.categories.list();

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

      <CategoryList categories={categories} />
    </React.Fragment>
  );
}
