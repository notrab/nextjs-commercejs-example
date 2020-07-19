import Link from "next/link";

import Category from "./Category";

export default function CategoryList({ categories }) {
  if (!categories) return null;

  return (
    <ul>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link href={`/categories/${category.slug}`}>
            <a>
              <Category {...category} />
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
